
// src/components/ControlButtons.jsx
import React from 'react';

const ControlButtons = ({ isRunning, toggleTimer, resetTimer }) => {
  return (
    <div className="d-flex justify-content-center w-100 mb-4" style={{ maxWidth: '500px' }}>
      <button 
        onClick={toggleTimer} 
        className={`btn ${isRunning ? 'btn-secondary' : 'btn-success'} me-3`}
        style={{ width: '5rem', height: '5rem' }}
      >
        {!isRunning ? (
          <i className="bi bi-play-fill fs-1"></i>
        ) : (
          <i className="bi bi-pause-fill fs-1"></i>
        )}
      </button>
      <button 
        onClick={resetTimer}
        className="btn btn-danger"
        style={{ width: '5rem', height: '5rem' }}
      >
        <i className="bi bi-x-lg fs-1"></i>
      </button>
    </div>
  );
};

export default ControlButtons;