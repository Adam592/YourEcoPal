import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsCarFrontFill, BsQrCodeScan, BsPersonFill } from 'react-icons/bs';

const FeatureSection = () => {
  return (
    <Container className="px-4 py-5" id="hanging-icons">
      <h2 className="pb-2 border-bottom">Explore Our Features</h2>
      <Row className="g-4 py-5 row-cols-1 row-cols-lg-3">
        
        <Col className="d-flex align-items-start">
          <div
            className="icon-square bg-success text-white d-inline-flex align-items-center justify-content-center flex-shrink-0 me-3 rounded-3"
            style={{ width: '3rem', height: '3rem', fontSize: '1.5rem' }}
          >
            <BsCarFrontFill />
          </div>
          <div>
            <h3 className="fs-4 text-body-emphasis">Track Your Journeys</h3>
            <p>Log your transportation habits and get feedback on how they affect the planet. Small changes in your daily routes can reduce your carbon footprint.</p>
          </div>
        </Col>

        <Col className="d-flex align-items-start">
          <div
            className="icon-square bg-success text-white d-inline-flex align-items-center justify-content-center flex-shrink-0 me-3 rounded-3"
            style={{ width: '3rem', height: '3rem', fontSize: '1.5rem' }}
          >
            <BsQrCodeScan />
          </div>
          <div>
            <h3 className="fs-4 text-body-emphasis">Scan Everyday Products</h3>
            <p>Use our QR scanner to learn about the environmental impact of your purchases and choose greener alternatives when shopping.</p>
          </div>
        </Col>

        <Col className="d-flex align-items-start">
          <div
            className="icon-square bg-success text-white d-inline-flex align-items-center justify-content-center flex-shrink-0 me-3 rounded-3"
            style={{ width: '3rem', height: '3rem', fontSize: '1.5rem' }}
          >
            <BsPersonFill />
          </div>
          <div>
            <h3 className="fs-4 text-body-emphasis">Personalized Profile</h3>
            <p>Set goals, monitor your progress, and see how your lifestyle evolves toward a more sustainable future — all in one place.</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FeatureSection;
