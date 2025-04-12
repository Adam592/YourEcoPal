import { useEffect } from 'react';
import { calculateDistance } from '../utils/geoUtils';

const useGeolocation = (journeyStatus, setLocation, setDistance, setRouteCoordinates) => {
  useEffect(() => {
    let watchId;
    let lastPosition = null;

    if (journeyStatus === 'inProgress' && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          let speed = position.coords.speed || 0;
          
          // Convert speed from m/s to km/h if available
          if (speed > 0) {
            speed = speed * 3.6; // Convert m/s to km/h
          }

          setLocation({
            latitude,
            longitude,
            speed,
          });

          const currentPosition = { latitude, longitude };
          setRouteCoordinates(prev => [...prev, currentPosition]);

          // Calculate distance if we have previous position
          if (lastPosition) {
            const segmentDistance = calculateDistance(
              lastPosition.latitude, 
              lastPosition.longitude, 
              latitude, 
              longitude
            );
            
            setDistance(prev => prev + segmentDistance);
          }

          lastPosition = currentPosition;
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [journeyStatus, setLocation, setDistance, setRouteCoordinates]);
};

export default useGeolocation;