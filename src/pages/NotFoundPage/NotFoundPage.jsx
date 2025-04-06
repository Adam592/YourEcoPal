import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NotFoundPage = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="text-center">
        <Col xs={12}>
          <h1 className="display-1 fw-bold text-success">404</h1>
          <div className="mb-4 lead">
            Oops! We couldn't find this page.
          </div>
          <p className="mb-4">
            The page you're looking for might have been removed, changed, or is temporarily unavailable.
          </p>
          <Button 
            variant="success" 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2"
          >
            Back to Homepage
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;