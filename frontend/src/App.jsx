import { useState, } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import CompanyPage from './CompanyPage'

function HomePage() {
  const [companyName, setCompanyName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/company/${companyName}`)
  }

  return (
    <>
      <div className="title-bar">
        <div className="title-content">
          <img src="/site_logo.svg" alt="iScope Logo" className="site-logo" />
          <h1>iScope</h1>
        </div>
      </div>
      <div className="content">
        <div className="hero">
          <h2 className="hero-title">Unlock Your Digital Research Potential</h2>
          <p className="hero-subtitle">Discover insights, track growth, and make data-driven decisions with iScope's comprehensive analysis platform</p>
        </div>
        <form onSubmit={handleSubmit} className="company-form">
          <div className="input-group">
            <label htmlFor="companyName">Company's Name</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>

        <div className="features-section">
          <h2 className="section-title">What We Do</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 0 0 0 0 3 8v8a2 2 1000 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3>Data Analysis</h3>
              <p>Advanced analytics to uncover valuable insights and trends in your company's data</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>Growth Tracking</h3>
              <p>Monitor your company's progress with real-time metrics and performance indicators</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <h3>Strategic Insights</h3>
              <p>Actionable recommendations to drive your business forward and optimize operations</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <>
      <HomePage />
    </>
  )
}

export default App
