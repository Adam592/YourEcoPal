import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ActivityPage = () => {
  // Basic location state from the original component
  const [location, setLocation] = useState({ speed: 0, latitude: 0, longitude: 0 });
  const [error, setError] = useState(null);
  
  // New states for enhanced functionality
  const [journeyStatus, setJourneyStatus] = useState('notStarted'); // 'notStarted', 'inProgress', 'finished'
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [transportMode, setTransportMode] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  
  // Refs for tracking
  const watchIdRef = useRef(null);
  const prevLocationRef = useRef(null);
  const timerRef = useRef(null);
  
  // Map variables
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylineRef = useRef(null);
  const markersRef = useRef([]);

  // Transport options
  const transportOptions = [
    { value: 'walking', label: 'Walking' },
    { value: 'running', label: 'Running' },
    { value: 'cycling', label: 'Cycling' },
    { value: 'driving', label: 'Driving' },
  ];

  // Initialize geolocation tracking
  useEffect(() => {
    // Check if Geolocation API is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    // Only start watching position if journey is in progress
    if (journeyStatus === 'inProgress') {
      // Watch the user's position
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { speed, latitude, longitude } = position.coords;
          setLocation({
            speed: speed ? speed * 3.6 : 0, // Convert speed from m/s to km/h
            latitude,
            longitude,
          });
          
          // Add current location to route coordinates
          setRouteCoordinates(prevCoords => [...prevCoords, [latitude, longitude]]);
          
          // Calculate distance if we have a previous location
          if (prevLocationRef.current) {
            const distanceIncrease = calculateDistance(
              prevLocationRef.current.latitude, 
              prevLocationRef.current.longitude,
              latitude,
              longitude
            );
            if (distanceIncrease > 0.001) { // Filter out small fluctuations (1 meter)
              setDistance(prev => prev + distanceIncrease);
            }
          }
          
          // Update previous location
          prevLocationRef.current = { latitude, longitude };
        },
        (err) => {
          setError(`Error retrieving location: ${err.message}`);
        },
        {
          enableHighAccuracy: true, // Use GPS for better accuracy
          maximumAge: 0,
          timeout: 10000,
        }
      );
      
      // Start timer to track elapsed time
      timerRef.current = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        if (startTime) {
          const elapsed = Math.floor((now - startTime) / 1000);
          setElapsedTime(elapsed);
        }
      }, 1000);
    }

    // Cleanup the watcher and timer on component unmount or when journey status changes
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [journeyStatus, startTime]);
  
  // Initialize and update map when showing map modal with route data
  useEffect(() => {
    if (showMapModal && routeCoordinates.length > 0 && mapRef.current) {
      // If map instance doesn't exist, create it
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(routeCoordinates[0], 13);
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);
      } else {
        // Reset the map view to the first coordinate
        mapInstanceRef.current.setView(routeCoordinates[0], 13);
      }
      
      // Clean up any existing polyline and markers
      if (polylineRef.current) {
        polylineRef.current.remove();
      }
      
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
      }
      
      // Add the route polyline
      polylineRef.current = L.polyline(routeCoordinates, {
        color: 'blue',
        weight: 3
      }).addTo(mapInstanceRef.current);
      
      // Fit the map bounds to show the entire route
      if (routeCoordinates.length > 1) {
        mapInstanceRef.current.fitBounds(polylineRef.current.getBounds());
      }
      
      // Add start and end markers
      const startMarker = L.marker(routeCoordinates[0])
        .bindPopup('Start Point')
        .addTo(mapInstanceRef.current);
        
      const endMarker = L.marker(routeCoordinates[routeCoordinates.length - 1])
        .bindPopup('End Point')
        .addTo(mapInstanceRef.current);
        
      markersRef.current.push(startMarker, endMarker);
    }
  }, [showMapModal, routeCoordinates]);
  
  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Convert degrees to radians
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Format elapsed time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  // Start journey button handler
  const handleStartJourney = () => {
    setShowTransportModal(true);
  };

  // Transport selection handlers
  const handleTransportSelect = (e) => {
    setTransportMode(e.target.value);
  };

  const handleTransportModalClose = () => {
    setShowTransportModal(false);
  };

  const handleTransportModalSubmit = () => {
    if (transportMode) {
      setShowTransportModal(false);
      setJourneyStatus('inProgress');
      setStartTime(new Date());
      setCurrentTime(new Date());
      setRouteCoordinates([]);
      setDistance(0);
      prevLocationRef.current = null;
    }
  };

  // End journey button handler
  const handleEndJourney = () => {
    setJourneyStatus('finished');
    setShowMapModal(true);
  };

  // Map modal handlers
  const handleMapModalClose = () => {
    setShowMapModal(false);
    setJourneyStatus('notStarted');
  };

  // Reset journey handler
  const handleResetJourney = () => {
    setJourneyStatus('notStarted');
    setTransportMode('');
    setStartTime(null);
    setCurrentTime(null);
    setElapsedTime(0);
    setDistance(0);
    setRouteCoordinates([]);
    setShowMapModal(false);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center mb-4">Activity Tracker</h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!error && (
            <Card>
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  {journeyStatus === 'notStarted' ? 'Ready to Start' : 
                   journeyStatus === 'inProgress' ? 'Journey in Progress' : 
                   'Journey Complete'}
                </Card.Title>
                
                {journeyStatus === 'notStarted' ? (
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={handleStartJourney}
                    >
                      Start Journey
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <strong>Transport Mode:</strong> {transportMode && transportMode.charAt(0).toUpperCase() + transportMode.slice(1)}
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
                      <strong>Current Location:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </div>
                    
                    {journeyStatus === 'inProgress' && (
                      <div className="d-grid gap-2 mt-4">
                        <Button 
                          variant="danger" 
                          size="lg" 
                          onClick={handleEndJourney}
                        >
                          End Journey
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Transport Mode Modal */}
      <Modal show={showTransportModal} onHide={handleTransportModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Transport Mode</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>How are you traveling?</Form.Label>
              <Form.Control 
                as="select" 
                value={transportMode}
                onChange={handleTransportSelect}
              >
                <option value="">-- Select --</option>
                {transportOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleTransportModalClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleTransportModalSubmit}
            disabled={!transportMode}
          >
            Start Tracking
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Map Modal */}
      <Modal 
        show={showMapModal} 
        onHide={handleMapModalClose} 
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Your Journey</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Transport Mode:</strong> {transportMode && transportMode.charAt(0).toUpperCase() + transportMode.slice(1)}
          </div>
          <div className="mb-3">
            <strong>Total Distance:</strong> {distance.toFixed(2)} km
          </div>
          <div className="mb-3">
            <strong>Total Duration:</strong> {formatTime(elapsedTime)}
          </div>
          
          {routeCoordinates.length > 0 && (
            <div 
              ref={mapRef} 
              style={{ height: '400px', width: '100%', marginTop: '20px' }}
            ></div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleResetJourney}>
            Start New Journey
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8} lg={6}>
          <div className="alert alert-info" role="alert">
            <p className="mb-0">
              <strong>Note:</strong> GPS data may not be accurate if the device is stationary or indoors.
              For best results, use this tracker in open areas. SDASDASD
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ActivityPage;