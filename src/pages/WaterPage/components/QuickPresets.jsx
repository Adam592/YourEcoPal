// src/components/QuickPresets.jsx
import React from 'react';

const QuickPresets = ({ applyPreset, isRunning }) => {
  return (
    <div className="w-100 mb-3" style={{ maxWidth: '500px' }}>
      <h3 className="text-center mb-2">Quick Presets</h3>
      <div className="d-flex justify-content-between">
        <button 
          onClick={() => applyPreset(0, 5, 0)} 
          className="btn btn-outline-secondary mx-1 py-2 w-100"
          disabled={isRunning}
        >
          <div className="text-center">5:00</div>
          <div className="text-center text-secondary">Shower</div>
        </button>
        <button 
          onClick={() => applyPreset(0, 2, 0)} 
          className="btn btn-outline-secondary mx-1 py-2 w-100"
          disabled={isRunning}
        >
          <div className="text-center">2:00</div>
          <div className="text-center text-secondary">Brushing</div>
        </button>
        <button 
          onClick={() => applyPreset(0, 10, 0)} 
          className="btn btn-outline-secondary mx-1 py-2 w-100"
          disabled={isRunning}
        >
          <div className="text-center">10:00</div>
          <div className="text-center text-secondary">Washing</div>
        </button>
      </div>
    </div>
  );
};

export default QuickPresets;