import React from 'react';
import './App.css';

// Simple test component first
export const TestComponent = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '50px', 
      left: '50px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '20px', 
      borderRadius: '10px',
      minWidth: '300px'
    }}>
      <h2>🎵 MiniLyrics Test</h2>
      <p>Floating lyrics window untuk Spotify</p>
      <div style={{ marginTop: '20px' }}>
        <p>✅ Component loaded successfully</p>
        <p>✅ CSS styling working</p>
        <p>✅ Text rendering correctly</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      position: 'relative'
    }}>
      <TestComponent />
      
      <div style={{
        position: 'fixed',
        bottom: '50px',
        right: '50px',
        background: 'rgba(29, 185, 84, 0.9)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        fontWeight: 'bold'
      }}>
        MiniLyrics Control Panel
      </div>
    </div>
  );
}

export default App;