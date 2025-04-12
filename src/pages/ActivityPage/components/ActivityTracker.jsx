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
    <>
      {journeyStatus === 'notStarted' ? (
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4">Ready to Start</Card.Title>
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" onClick={handleStartJourney}>
                Start Journey
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : journeyStatus === 'inProgress' ? (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Journey in Progress</h5>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Transport Mode:</strong>{' '}
                  {transportMode.charAt(0).toUpperCase() + transportMode.slice(1)}
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
              </div>
              <div className="modal-footer">
                <Button variant="danger" onClick={handleEndJourney}>
                  End Journey
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4">Journey Complete</Card.Title>
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
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default ActivityTracker;