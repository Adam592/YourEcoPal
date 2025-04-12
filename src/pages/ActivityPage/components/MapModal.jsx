import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const MapModal = ({
  show,
  mapRef,
  handleMapModalClose,
}) => {
  return (
    <Modal show={show} onHide={handleMapModalClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Journey Map</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          ref={mapRef}
          style={{
            height: '400px', // Set a fixed height
            width: '100%', // Set width to fill the container
            border: '1px solid #ddd', // Optional: Add a border for clarity
          }}
        ></div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleMapModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MapModal;