import { useEffect, useRef } from 'react';

const useGeolocation = (journeyStatus, setLocation, setDistance, calculateDistance, setRouteCoordinates) => {
  const watchIdRef = useRef(null);
  const prevLocationRef = useRef(null);

  useEffect(() => {
    if (journeyStatus === 'inProgress') {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { speed, latitude, longitude } = position.coords;
          setLocation({
            speed: speed ? speed * 3.6 : 0, // Convert m/s to km/h
            latitude,
            longitude,
          });

          if (prevLocationRef.current) {
            const distanceIncrease = calculateDistance(
              prevLocationRef.current.latitude,
              prevLocationRef.current.longitude,
              latitude,
              longitude
            );
            if (distanceIncrease > 0.001) {
              setDistance((prev) => prev + distanceIncrease);
            }
          }

          prevLocationRef.current = { latitude, longitude };

          // Append the current location to routeCoordinates
          setRouteCoordinates((prev) => [...prev, { latitude, longitude }]);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [journeyStatus]);
};

export default useGeolocation;