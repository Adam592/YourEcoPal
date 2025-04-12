import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useActiveComponent } from './hooks/useActiveComp';
import BottomNav from './components/BottomNav';

const MainPage = () => {
  const { activeComponent, setActiveComponent, renderComponent } = useActiveComponent();

  const pageStyle = {
      backgroundColor: '#e8f5e9',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    };
    
  return (
    <Container fluid className="d-flex flex-column min-vh-100 p-0">
      <Row className="flex-grow-1 m-0">
        <Col className="p-3" style={pageStyle}>{renderComponent({ setActiveComponent })}</Col>
      </Row>

      <BottomNav
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
    </Container>
  );
};

export default MainPage;
