import React from 'react';

const ScanButton = ({ onClick }) => {
  return (
    <div className="text-center">
      <button 
        className="btn btn-outline-success rounded-circle p-4 mb-3"
        onClick={onClick}
        style={{ width: '100px', height: '100px', fontSize: '2rem' }}
      >
        +
      </button>
      <p className="text-muted">Tap to scan barcode</p>
    </div>
  );
};

export default ScanButton;