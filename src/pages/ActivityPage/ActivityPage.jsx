import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ActivityTracker from './components/ActivityTracker';
import TransportModal from './components/TransportModal';
import MapModal from './components/MapModal';
import useGeolocation from './hooks/useGeolocation';
import useMap from './hooks/useMap';

const ActivityPage = () => {
  const [journeyStatus, setJourneyStatus] = useState('notStarted');
  const [transportMode, setTransportMode] = useState('');
  const [location, setLocation] = useState({ speed: 0, latitude: 0, longitude: 0 });
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [completedJourneys, setCompletedJourneys] = useState([]); // New state for completed journeys

  const mapRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (journeyStatus === 'inProgress') {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [journeyStatus]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hours, minutes, secs].map((val) => val.toString().padStart(2, '0')).join(':');
  };

  useGeolocation(journeyStatus, setLocation, setDistance, calculateDistance, setRouteCoordinates);
  useMap(showMapModal, routeCoordinates, mapRef);

  const handleStartJourney = () => setShowTransportModal(true);

  const handleEndJourney = () => {
    setJourneyStatus('finished');
    setShowMapModal(true);

    // Save the completed journey
    setCompletedJourneys((prev) => [
      ...prev,
      {
        transportMode,
        distance: distance.toFixed(2),
        elapsedTime: formatTime(elapsedTime),
      },
    ]);
  };

  const handleResetJourney = () => {
    setJourneyStatus('notStarted');
    setTransportMode('');
    setDistance(0);
    setElapsedTime(0);
    setRouteCoordinates([]);
    setShowMapModal(false);
    clearInterval(timerRef.current);
  };

  const handleMapModalClose = () => {
    // Reset the activity tracker when the map modal is closed
    handleResetJourney();
  };

  return (
    <Container className="py-5">
      {/* Completed Journeys Table */}
      <Row className="mb-4">
        <Col>
          <h4>Completed Journeys</h4>
          {completedJourneys.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Transport Mode</th>
                  <th>Distance (km)</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {completedJourneys.map((journey, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{journey.transportMode}</td>
                    <td>{journey.distance}</td>
                    <td>{journey.elapsedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No journeys completed yet.</p>
          )}
        </Col>
      </Row>



      {/* Activity Tracker */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={8} lg={6}>
          <ActivityTracker
            journeyStatus={journeyStatus}
            transportMode={transportMode}
            location={location}
            distance={distance}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            handleStartJourney={handleStartJourney}
            handleEndJourney={handleEndJourney}
          />
        </Col>
      </Row>

      {/* Transport Modal */}
      <TransportModal
        show={showTransportModal}
        transportMode={transportMode}
        transportOptions={[
          { value: 'walking', label: 'Walking' },
          { value: 'running', label: 'Running' },
          { value: 'cycling', label: 'Cycling' },
          { value: 'driving', label: 'Driving' },
        ]}
        handleTransportSelect={(e) => setTransportMode(e.target.value)}
        handleTransportModalClose={() => setShowTransportModal(false)}
        handleTransportModalSubmit={() => {
          if (transportMode) {
            setShowTransportModal(false);
            setJourneyStatus('inProgress');
            setRouteCoordinates([]);
          }
        }}
      />

      {/* Map Modal */}
      <MapModal
        show={showMapModal}
        transportMode={transportMode}
        distance={distance}
        elapsedTime={elapsedTime}
        formatTime={formatTime}
        routeCoordinates={routeCoordinates}
        mapRef={mapRef}
        handleMapModalClose={handleMapModalClose} // Close button now resets the tracker
      />
    </Container>
  );
};

export default ActivityPage;