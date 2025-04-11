import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const TransportModal = ({
  show,
  transportMode,
  transportOptions,
  handleTransportSelect,
  handleTransportModalClose,
  handleTransportModalSubmit,
}) => {
  return (
    <Modal show={show} onHide={handleTransportModalClose} centered>
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
              {transportOptions.map((option) => (
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
  );
};

export default TransportModal;