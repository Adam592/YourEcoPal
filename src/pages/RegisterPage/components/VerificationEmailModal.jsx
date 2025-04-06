import React from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';

const VerificationEmailModal = ({ 
  show, 
  onHide, 
  success, 
  resendError, 
  resendSuccess, 
  handleResendVerification, 
  isProcessing 
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Verification Link</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p>{success}</p>
        
        {resendError && <Alert variant="danger" className="mt-3">{resendError}</Alert>}
        {resendSuccess && <Alert variant="success" className="mt-3">{resendSuccess}</Alert>}
      </Modal.Body>
      
      <Modal.Footer>
        <Button 
          variant="success"
          onClick={handleResendVerification}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Wysyłanie...
            </>
          ) : (
            "Send again"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VerificationEmailModal;