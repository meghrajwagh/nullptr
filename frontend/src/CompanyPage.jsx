import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { analyzeCompany } from './services/api';
import ForceGraph2D from 'react-force-graph-2d';
import './CompanyPage.css';
// import * as d3 from 'd3';

export default function CompanyPage() {
  const graphRef = useRef();
  const { company } = useParams();
  const [analysisData, setAnalysisData] = useState(null);
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
        console.error('Error fetching analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [company]);

  if (loading) {
    return (
      <div className="company-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing {company}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const graphData = {
    nodes: analysisData.nodes.map((node) => ({ id: node.id })),
    links: analysisData.edges.map((edge) => ({
      source: edge.source_node,
      target: edge.target_node
    }))
  };

  return (
    <div className="company-page" style={{ height: '100vh', width: '100vw' }}>
      <ForceGraph2D
        graphData={graphData}
        backgroundColor="rgba(0, 0, 0, 0)"
        linkColor={() => 'rgba(255, 255, 255, 0.4)'}
        linkWidth={() => 2}
        width={window.innerWidth}
        height={window.innerHeight}
        nodeDraggable={true}
        cooldownTicks={100}

        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 15 / globalScale;
          const radius = 2;

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#00b4d8';
          ctx.fill();

          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = 'white';
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
    </div>
  );
}
