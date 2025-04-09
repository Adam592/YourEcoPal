// src/components/TimerDisplay.jsx
import React from 'react';

const TimerDisplay = ({ hours, minutes, seconds }) => {
  // Format time with leading zeros
  const formatTime = (value) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="w-100 bg-dark rounded mb-4 p-3" style={{ maxWidth: '500px' }}>
      <div className="text-success fs-1 text-center font-monospace" style={{ letterSpacing: '0.5em' }}>
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </div>
    </div>
  );
};

export default TimerDisplay;