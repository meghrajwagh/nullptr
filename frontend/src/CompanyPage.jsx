import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { analyzeCompany } from './services/api';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3';
import './CompanyPage.css';

export default function CompanyPage() {
  const { company } = useParams();
  const graphRef = useRef();

  const [analysisData, setAnalysisData] = useState(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null); // ✅ new
  const [pathLinks, setPathLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const result = await analyzeCompany(company);
        setAnalysisData(result);
        setError(null);
      } catch (err) {
        setError('Failed to fetch company analysis. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [company]);

  const graphData = useMemo(() => {
    if (!analysisData) return { nodes: [], links: [] };
    return {
      nodes: analysisData.nodes.map((node) => ({ id: node.id })),
      links: analysisData.edges.map((edge) => ({
        source: edge.source_node,
        target: edge.target_node,
        relation: edge.relation || ''
      }))
    };
  }, [analysisData]);

  useEffect(() => {
    if (!graphRef.current || !analysisData) return;

    graphRef.current.d3Force('radial', d3.forceRadial(200));
    graphRef.current.d3Force('charge').strength(-100);
    graphRef.current.d3Force('collide', d3.forceCollide(70));
    graphRef.current.d3Force('link').distance(100);
    graphRef.current.d3ReheatSimulation();
  }, [analysisData]);

  const computePath = (targetId) => {
    const links = graphData.links;
    const nodesMap = {};
    links.forEach((l) => {
      if (!nodesMap[l.source]) nodesMap[l.source] = [];
      nodesMap[l.source].push(l);
    });

    const queue = [{ id: company, path: [] }];
    const visited = new Set();

    while (queue.length) {
      const { id, path } = queue.shift();
      if (id === targetId) return path;

      visited.add(id);
      (nodesMap[id] || []).forEach((link) => {
        if (!visited.has(link.target)) {
          queue.push({ id: link.target, path: [...path, link] });
        }
      });
    }
    return [];
  };

  if (loading) {
    return <div className="company-page">Analyzing {company}...</div>;
  }

  if (error) {
    return <div className="company-page">Error: {error}</div>;
  }

  return (
    <div className="company-page" style={{ height: '100vh', width: '100vw' }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        backgroundColor="rgba(0, 0, 0, 0)"
        width={window.innerWidth}
        height={window.innerHeight}
        nodeDraggable={true}
        cooldownTicks={100}
        linkColor={(link) =>
          selectedNode &&
          (link.source.id === selectedNode.id || link.target.id === selectedNode.id)
            ? 'black'
            : '#aaa'
        }
        linkWidth={(link) =>
          pathLinks.some(
            (p) => p.source === link.source && p.target === link.target
          )
            ? 3
            : 1.5
        }
        onNodeHover={setHoverNode}
        onNodeClick={(node) => {
          if (!node || node.x == null || node.y == null) return;

          setSelectedNode(node);
          setSelectedEdge(null); // ✅ clear edge
          const path = computePath(node.id);
          setPathLinks(path);

          graphRef.current.centerAt(node.x, node.y, 1000);
          graphRef.current.zoom(3, 1000);
        }}
        onLinkClick={(link) => {
          setSelectedEdge(link);
          setSelectedNode(null); // ✅ clear node
          setPathLinks([]);

          const source = typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === link.source);
          const target = typeof link.target === 'object' ? link.target : graphData.nodes.find(n => n.id === link.target);

          if (source && target && source.x != null && target.x != null) {
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            graphRef.current.centerAt(midX, midY, 1000);
            graphRef.current.zoom(3, 1000);
          }
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize =
            hoverNode?.id === node.id || selectedNode?.id === node.id
              ? 20 / globalScale
              : 14 / globalScale;
          const radius = 4;

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#00b4d8';
          ctx.fill();

          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle =
            selectedNode?.id === node.id
              ? 'black'
              : hoverNode?.id === node.id
              ? 'black'
              : 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(label, node.x, node.y - radius - 2);
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          const size = 10;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
      />

      {(selectedEdge || selectedNode) && (
        <div className="info-panel">
          {selectedEdge ? (
            <>
              <h2>Edge Info</h2>
              <p><strong>Source:</strong> {selectedEdge.source.id}</p>
              <p><strong>Target:</strong> {selectedEdge.target.id}</p>
              <p><strong>Relation:</strong> {selectedEdge.relation || 'N/A'}</p>
            </>
          ) : (
            <>
              <h2>{selectedNode.id}</h2>
              <h3>Origin: {company}</h3>
              {pathLinks.length > 0 && (
                <>
                  <h3>Relation Path:</h3>
                  <ul>
                    {pathLinks.map((link, idx) => (
                      <li key={idx}>
                        {link.source} → {link.target}
                        <br />
                        <em>{link.relation}</em>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
