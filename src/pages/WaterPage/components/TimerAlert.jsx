// src/components/TimerAlert.jsx
import React from 'react';

const TimerAlert = ({ handleCloseAlert }) => {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
      <div className="bg-white p-4 rounded shadow-lg" style={{ maxWidth: '300px' }}>
        <h3 className="fs-5 fw-bold mb-2">Time's Up!</h3>
        <p>Your water timer has finished. Great job saving water!</p>
        <button 
          onClick={handleCloseAlert}
          className="btn btn-success w-100 mt-3"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TimerAlert;