import React, { useEffect } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../../features/auth/components/LoginForm/LoginForm";
import { useAuth } from "../../features/auth/context/AuthContext";
import useLogin from "./hooks/useLogin";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isEmailVerified } = useAuth();
  const from = location.state?.from?.pathname || "/dashboard";

  const { error, loading, handleSubmit, handleGoogleLogin } = useLogin();

  useEffect(() => {
    if (isAuthenticated) {
      if (isEmailVerified) {
        navigate(from, { replace: true });
      } else {
        navigate("/verify-email-notice", { replace: true });
      }
    }
  }, [isAuthenticated, isEmailVerified, navigate, from]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col>
          <Card className="p-4 shadow-lg rounded-4" style={{ minWidth: "350px" }}>
            <Card.Body>
              <h3 className="text-center mb-4">Sign in</h3>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {loading ? (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <LoginForm onSubmit={handleSubmit} onGoogleLogin={handleGoogleLogin} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
