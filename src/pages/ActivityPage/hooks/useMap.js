import { useEffect, useRef } from 'react';
import L from 'leaflet';

const useMap = (showMapModal, routeCoordinates, mapRef) => {
  const mapInstanceRef = useRef(null);
  const polylineRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (showMapModal && routeCoordinates.length > 0) {
      const firstCoordinate = [routeCoordinates[0].latitude, routeCoordinates[0].longitude];

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(firstCoordinate, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapInstanceRef.current);
      }

      if (polylineRef.current) {
        polylineRef.current.remove();
      }

      if (markersRef.current.length > 0) {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
      }

      const latLngs = routeCoordinates.map((coord) => [coord.latitude, coord.longitude]);
      polylineRef.current = L.polyline(latLngs, { color: 'blue', weight: 3 }).addTo(mapInstanceRef.current);

      if (routeCoordinates.length > 1) {
        mapInstanceRef.current.fitBounds(polylineRef.current.getBounds());
      }

      const startMarker = L.marker(latLngs[0]).bindPopup('Start Point').addTo(mapInstanceRef.current);
      const endMarker = L.marker(latLngs[latLngs.length - 1]).bindPopup('End Point').addTo(mapInstanceRef.current);

      markersRef.current.push(startMarker, endMarker);

      // Invalidate size to fix rendering issues
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 0);
    }

    return () => {
      if (!showMapModal && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMapModal, routeCoordinates]);
};

export default useMap;