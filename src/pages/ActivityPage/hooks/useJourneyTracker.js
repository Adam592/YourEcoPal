import { useState, useRef, useEffect, useCallback } from 'react';

const useJourneyTracker = () => {
  const [journeyStatus, setJourneyStatus] = useState('notStarted');
  const [transportMode, setTransportMode] = useState('');
  const [location, setLocation] = useState({ speed: 0, latitude: 0, longitude: 0 });
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  
  const timerRef = useRef(null);

  // Format time helper
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hours, minutes, secs].map((val) => val.toString().padStart(2, '0')).join(':');
  }, []);

  // Timer effect
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

  const handleStartJourney = useCallback(() => setShowTransportModal(true), []);

  const handleEndJourney = useCallback(() => {
    setJourneyStatus('finished');
    setShowMapModal(true);
    
    // Return journey data
    return {
      transportMode,
      distance: distance.toFixed(2),
      elapsedTime: formatTime(elapsedTime),
      timestamp: new Date(),
    };
  }, [transportMode, distance, elapsedTime, formatTime]);

  const handleResetJourney = useCallback(() => {
    setJourneyStatus('notStarted');
    setTransportMode('');
    setDistance(0);
    setElapsedTime(0);
    setRouteCoordinates([]);
    setShowMapModal(false);
    clearInterval(timerRef.current);
  }, []);

  const handleMapModalClose = useCallback(() => {
    handleResetJourney();
  }, [handleResetJourney]);

  const handleTransportSelect = useCallback((e) => setTransportMode(e.target.value), []);

  const handleTransportModalClose = useCallback(() => setShowTransportModal(false), []);

  const handleTransportModalSubmit = useCallback(() => {
    if (transportMode) {
      setShowTransportModal(false);
      setJourneyStatus('inProgress');
      setRouteCoordinates([]);
    }
  }, [transportMode]);

  return {
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
    handleResetJourney,
    handleMapModalClose,
    handleTransportSelect,
    handleTransportModalClose,
    handleTransportModalSubmit,
    formatTime
  };
};

export default useJourneyTracker;