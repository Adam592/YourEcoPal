import React from 'react';
import { Card } from 'react-bootstrap';

const JourneyStats = ({ totalJourneys, co2SavedMonth, mostUsedTransport }) => {
  return (
    <Card className="border">
      <Card.Body>
        <h5 className="mb-3">Your Journey Stats</h5>
        
        <div className="mb-2 d-flex justify-content-between">
          <span className="text-secondary">Total Journeys:</span>
          <span>{totalJourneys}</span>
        </div>
        
        <div className="mb-2 d-flex justify-content-between">
          <span className="text-secondary">CO₂ Saved This Month:</span>
          <span>{co2SavedMonth} kg</span>
        </div>
        
        <div className="mb-2 d-flex justify-content-between">
          <span className="text-secondary">Most Used Transport:</span>
          <span>{mostUsedTransport}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default JourneyStats;