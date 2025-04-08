import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useActiveComponent } from './hooks/useActiveComp';
import BottomNav from './components/BottomNav';

const MainPage = () => {
  const { activeComponent, setActiveComponent, renderComponent } = useActiveComponent();

  return (
    <Container fluid className="d-flex flex-column min-vh-100 p-0">
      <Row className="flex-grow-1 m-0">
        <Col className="p-3 bg-light">{renderComponent()}</Col>
      </Row>

      <BottomNav
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
    </Container>
  );
};

export default MainPage;
