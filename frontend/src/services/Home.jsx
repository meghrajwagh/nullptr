// src/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/company/${input}`);
    }
  };

  return (
    <div className="home-container">
      <div className="logo">iScope</div>
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter company name (e.g. OpenAI)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Analyze</button>
      </form>
    </div>
  );
}
