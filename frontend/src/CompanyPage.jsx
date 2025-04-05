import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { analyzeCompany } from './services/api'
import ForceGraph2D from 'react-force-graph-2d'
import './CompanyPage.css'

export default function CompanyPage() {
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
    nodes: analysisData.nodes.map(node => ({ id: node.id })),
    links: analysisData.edges.map(edge => ({
      source: edge.source_node,
      target: edge.target_node
    }))
  };

  return (
    <div className="company-page">
      <div className="title-bar">
        <div className="title-content">
          <img src="/site_logo.svg" alt="iScope Logo" className="site-logo" />
          <h1>iScope</h1>
        </div>
      </div>
      
      <div className="content">
        {analysisData && (
          <div className="analysis-container">
            <div className="graph-card">
              <div className="graph-container">
              <ForceGraph2D
        graphData={graphData}
        backgroundColor="rgba(0, 0, 0, 0)"
        width={window.innerWidth}
        height={window.innerHeight}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = '#00b4d8';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, node.x, node.y);
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          const size = 5;
          ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size);
        }}
      />

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}