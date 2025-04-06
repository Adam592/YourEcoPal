import React from 'react';
import { Alert, Button, Spinner } from "react-bootstrap";

const useRenderContent = (verifying, error, success, mode, handleGoToLogin) => {
  if (verifying) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p className="mt-3">Verifying your email...</p>
      </div>
    );
  }

  if (mode === 'verifyEmail') {
    return (
      <>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <>
            <Alert variant="success">{success}</Alert>
            <div className="d-grid">
              <Button variant="success" onClick={handleGoToLogin}>
                Go to Login
              </Button>
            </div>
          </>
        )}
      </>
    );
  }
};

export default useRenderContent;
