// src/components/TimerControls.jsx
import React from 'react';

const TimerControls = ({
  isRunning,
  incrementHours,
  decrementHours,
  incrementMinutes,
  decrementMinutes,
  incrementSeconds,
  decrementSeconds
}) => {
  return (
    <>
      {/* Time labels */}
      <div className="row w-100 mb-2" style={{ maxWidth: '500px' }}>
        <div className="col-4 text-center text-secondary">Hours</div>
        <div className="col-4 text-center text-secondary">Minutes</div>
        <div className="col-4 text-center text-secondary">Seconds</div>
      </div>
      
      {/* Timer Controls */}
      <div className="row w-100 mb-4" style={{ maxWidth: '500px' }}>
        {/* Hours controls */}
        <div className="col-4 d-flex flex-column align-items-center">
          <button 
            onClick={decrementHours} 
            className="btn btn-light border mb-2" 
            style={{ width: '3rem', height: '3rem' }}
            disabled={isRunning}
          >
            <span className="fs-3">-</span>
          </button>
          <button 
            onClick={incrementHours} 
            className="btn btn-light border" 
            style={{ width: '3rem', height: '3rem' }}
            disabled={isRunning}
          >
            <span className="fs-3">+</span>
          </button>
        </div>
        
        {/* Minutes controls */}
        <div className="col-4 d-flex flex-column align-items-center">
          <button 
            onClick={decrementMinutes} 
            className="btn btn-light border mb-2" 
            style={{ width: '3rem', height: '3rem' }}
            disabled={isRunning}
          >
            <span className="fs-3">-</span>
          </button>
          <button 
            onClick={incrementMinutes} 
            className="btn btn-light border" 
            style={{ width: '3rem', height: '3rem' }}
            disabled={isRunning}
          >
            <span className="fs-3">+</span>
          </button>
        </div>
        
        {/* Seconds controls */}
        <div className="col-4 d-flex flex-column align-items-center">
          <button 
            onClick={decrementSeconds} 
            className="btn btn-light border mb-2" 
            style={{ width: '3rem', height: '3rem' }}
            disabled={isRunning}
          >
            <span className="fs-3">-</span>
          </button>
          <button 
            onClick={incrementSeconds} 
            className="btn btn-light border" 
            style={{ width: '3rem', height: '3rem' }}
            disabled={isRunning}
          >
            <span className="fs-3">+</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default TimerControls;