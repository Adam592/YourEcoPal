import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ActivityTracker = ({
  journeyStatus,
  transportMode,
  location,
  distance,
  elapsedTime,
  formatTime,
  handleStartJourney,
  handleEndJourney,
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="text-center mb-4">
          {journeyStatus === 'notStarted'
            ? 'Ready to Start'
            : journeyStatus === 'inProgress'
            ? 'Journey in Progress'
            : 'Journey Complete'}
        </Card.Title>

        {journeyStatus === 'notStarted' ? (
          <div className="d-grid gap-2">
            <Button variant="primary" size="lg" onClick={handleStartJourney}>
              Start Journey
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <strong>Transport Mode:</strong>{' '}
              {transportMode &&
                transportMode.charAt(0).toUpperCase() + transportMode.slice(1)}
            </div>
            <div className="mb-3">
              <strong>Speed:</strong> {location.speed.toFixed(2)} km/h
            </div>
            <div className="mb-3">
              <strong>Distance:</strong> {distance.toFixed(2)} km
            </div>
            <div className="mb-3">
              <strong>Duration:</strong> {formatTime(elapsedTime)}
            </div>
            <div className="mb-3">
              <strong>Current Location:</strong>{' '}
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </div>

            {journeyStatus === 'inProgress' && (
              <div className="d-grid gap-2 mt-4">
                <Button variant="danger" size="lg" onClick={handleEndJourney}>
                  End Journey
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ActivityTracker;