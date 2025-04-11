import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ActivityTracker from './components/ActivityTracker';
import TransportModal from './components/TransportModal';
import MapModal from './components/MapModal';
import useGeolocation from './hooks/useGeolocation';
import useMap from './hooks/useMap';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../../features/auth/context/AuthContext';

const checkAndCreateUserDocument = async (userId) => {
  const db = getFirestore();
  const userDocRef = doc(db, "journeys", userId);

  try {
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Document does not exist, create it
      await setDoc(userDocRef, {
        createdAt: new Date(),
      });
      console.log("Document created successfully.");
    } else {
      console.log("Document already exists.");
    }
  } catch (error) {
    console.error("Error checking or creating document:", error);
  }
};

const ActivityPage = () => {
  const [journeyStatus, setJourneyStatus] = useState('notStarted');
  const [transportMode, setTransportMode] = useState('');
  const [location, setLocation] = useState({ speed: 0, latitude: 0, longitude: 0 });
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [completedJourneys, setCompletedJourneys] = useState([]); // State for completed journeys

  const mapRef = useRef(null);
  const timerRef = useRef(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.uid) {
      checkAndCreateUserDocument(currentUser.uid);
      fetchCompletedJourneys(currentUser.uid); // Fetch journeys on load
    }
  }, [currentUser]);

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

  const fetchCompletedJourneys = async (userId) => {
    const db = getFirestore();
    const journeysCollectionRef = collection(db, "journeys", userId, "users_journeys");

    try {
      const querySnapshot = await getDocs(journeysCollectionRef);
      const journeys = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompletedJourneys(journeys);
    } catch (error) {
      console.error("Error fetching completed journeys:", error);
    }
  };

  const saveCompletedJourney = async (userId, journey) => {
    const db = getFirestore();
    const journeysCollectionRef = collection(db, "journeys", userId, "users_journeys");

    try {
      await addDoc(journeysCollectionRef, journey);
      console.log("Journey saved successfully.");
      fetchCompletedJourneys(userId); // Refresh the table after saving
    } catch (error) {
      console.error("Error saving journey:", error);
    }
  };

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

    const journey = {
      transportMode,
      distance: distance.toFixed(2),
      elapsedTime: formatTime(elapsedTime),
      timestamp: new Date(),
    };

    if (currentUser?.uid) {
      saveCompletedJourney(currentUser.uid, journey);
    }
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
    handleResetJourney();
  };

  return (
    <Container className="py-5">
      {currentUser?.uid && (
        <div className="mb-4">
          <div>
            <strong>User ID:</strong>
          </div>
          <div>{currentUser.uid}</div>
        </div>
      )}

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
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {completedJourneys.map((journey, index) => (
                  <tr key={journey.id}>
                    <td>{index + 1}</td>
                    <td>{journey.transportMode}</td>
                    <td>{journey.distance}</td>
                    <td>{journey.elapsedTime}</td>
                    <td>{new Date(journey.timestamp.toDate()).toLocaleString()}</td>
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
        handleMapModalClose={handleMapModalClose}
      />
    </Container>
  );
};

export default ActivityPage;