import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/firebase/authService";

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>Dashboard</h1>
          <p className="lead">Witaj, {currentUser?.displayName || currentUser?.email}!</p>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Profil użytkownika</Card.Title>
              <Card.Text>
                Zarządzaj swoimi danymi osobowymi i preferencjami konta.
              </Card.Text>
              <Button 
                variant="primary" 
                onClick={() => navigate("/profile")}
              >
                Edytuj profil
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Ustawienia bezpieczeństwa</Card.Title>
              <Card.Text>
                Zmień hasło i skonfiguruj dodatkowe zabezpieczenia konta.
              </Card.Text>
              <Button variant="primary">Zarządzaj bezpieczeństwem</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Wyloguj się</Card.Title>
              <Card.Text>
                Zakończ bieżącą sesję i wyloguj się z systemu.
              </Card.Text>
              <Button 
                variant="outline-danger" 
                onClick={() => logout().then(() => navigate("/login"))}
              >
                Wyloguj się
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;