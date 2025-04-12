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
            <Form.Select
              value={transportMode}
              onChange={handleTransportSelect}
            >
              <option value="">-- Select --</option>
              {transportOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleTransportModalClose}>
          Cancel
        </Button>
        <Button
          variant="success"
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