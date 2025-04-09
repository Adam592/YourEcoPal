// src/components/DidYouKnow.jsx
import React from 'react';

const DidYouKnow = ({ monthlySavings }) => {
  return (
    <div className="w-100 border rounded p-3 bg-white mt-3" style={{ maxWidth: '500px' }}>
      <h3 className="text-center mb-2">Did you know?</h3>
      <p className="text-secondary small">
        A 5-minute shower can use 10-25 gallons of water. Shortening your shower by just 2 minutes can save up to 10 gallons!
      </p>
      <p className="text-success fw-medium mt-2">
        Your savings this month: {monthlySavings} gallons
      </p>
    </div>
  );
};

export default DidYouKnow;