import React, { useRef } from 'react';
import { Container, Card } from 'react-bootstrap';
import ActivityTracker from './components/ActivityTracker';
import TransportModal from './components/TransportModal';
import MapModal from './components/MapModal';
import JourneyStats from './components/JourneyStats';
import AddJourneyForm from './components/AddJourneyForm';
import PastJourneysTable from './components/PastJourneysTable';
import useGeolocation from './hooks/useGeolocation';
import useMap from './hooks/useMap';
import useJourneys from './hooks/useJourneys';
import useJourneyStats from './hooks/useJourneyStats';
import useJourneyTracker from './hooks/useJourneyTracker';
import { useAuth } from '../../features/auth/context/AuthContext';

const ActivityPage = () => {
  const mapRef = useRef(null);
  const { currentUser } = useAuth();

  // Use our custom hooks
  const {
    journeyStatus,
    transportMode,
    location,
    distance,
    elapsedTime,
    routeCoordinates,
    showTransportModal,
    showMapModal,
    setLocation,
    setDistance,
    setRouteCoordinates,
    handleStartJourney,
    handleEndJourney,
    handleMapModalClose,
    handleTransportSelect,
    handleTransportModalClose,
    handleTransportModalSubmit,
    formatTime
  } = useJourneyTracker();

  const { completedJourneys, saveCompletedJourney } = useJourneys(currentUser);
  const stats = useJourneyStats(completedJourneys);

  // Setup geolocation tracking
  useGeolocation(journeyStatus, setLocation, setDistance, setRouteCoordinates);
  useMap(showMapModal, routeCoordinates, mapRef);

  // Handle journey end and save to Firestore
  const handleJourneyEnd = () => {
    const journey = handleEndJourney();
    
    if (currentUser?.uid) {
      saveCompletedJourney(currentUser.uid, journey);
    }
  };

  return (
    <Container className="py-4" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh' }}>
      {/* Track Journey Form */}
      <Card className="border-success mb-4">
        <Card.Header className="bg-transparent border-success text-center">
          <h4 className="mb-0">Track Journey</h4>
        </Card.Header>
        <Card.Body>
          <AddJourneyForm onStartJourney={handleStartJourney} />
        </Card.Body>
      </Card>

      {/* Past Journeys Table */}
      <PastJourneysTable journeys={completedJourneys} />

      {/* Journey Stats */}
      <JourneyStats 
        totalJourneys={stats.totalJourneys}
        co2SavedMonth={stats.co2SavedMonth}
        mostUsedTransport={stats.mostUsedTransport}
      />

      {/* Transport Modal */}
      <TransportModal
        show={showTransportModal}
        transportMode={transportMode}
        transportOptions={[
          { value: 'walking', label: 'Walking' },
          { value: 'running', label: 'Running' },
          { value: 'cycling', label: 'Cycling' },
          { value: 'bus', label: 'Bus' },
          { value: 'driving', label: 'Driving' },
        ]}
        handleTransportSelect={handleTransportSelect}
        handleTransportModalClose={handleTransportModalClose}
        handleTransportModalSubmit={handleTransportModalSubmit}
      />

      {/* Map Modal */}
      <MapModal
        show={showMapModal}
        mapRef={mapRef}
        handleMapModalClose={handleMapModalClose}
      />

      {/* Activity Tracker Modal (shown when journey in progress) */}
      {journeyStatus === 'inProgress' && (
        <ActivityTracker
          journeyStatus={journeyStatus}
          transportMode={transportMode}
          location={location}
          distance={distance}
          elapsedTime={elapsedTime}
          formatTime={formatTime}
          handleEndJourney={handleJourneyEnd}
        />
      )}
    </Container>
  );
};

export default ActivityPage;