import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import RegisterForm from "../../features/auth/components/RegisterForm/RegisterForm";
import { useAuth } from "../../features/auth/context/AuthContext";
import useRegister from "./hooks/useRegister";
import useResendVerification from "./hooks/useResendVerification";
import VerificationEmailModal from "./components/VerificationEmailModal";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isEmailVerified } = useAuth();
  const from = location.state?.from?.pathname || "/dashboard";
  const [showModal, setShowModal] = useState(false);

  const { error, success, loading, handleSubmit } = useRegister();
  const { isProcessing, error: resendError, success: resendSuccess, handleResendVerification } = useResendVerification();

  useEffect(() => {
    if (isAuthenticated && isEmailVerified) {
        navigate(from, { replace: true });
    }
  }, [isAuthenticated, isEmailVerified, navigate, from]);

  useEffect(() => {
    if (success) {
      setShowModal(true);
    }
  }, [success]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col> 
          <Card className="p-4 shadow-lg rounded-4" style={{ minWidth: "350px" }}>
            <Card.Body>
              <h3 className="text-center mb-4">Create an Account</h3>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <VerificationEmailModal
                show={showModal}
                onHide={() => setShowModal(false)}
                success={success}
                resendError={resendError}
                resendSuccess={resendSuccess}
                handleResendVerification={handleResendVerification}
                isProcessing={isProcessing}
              />

              {loading ? (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <RegisterForm 
                  onSubmit={handleSubmit} 
                  isProcessing={isProcessing} 
                  resendError={resendError}
                  resendSuccess={resendSuccess}
                  handleResendVerification={handleResendVerification} 
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;