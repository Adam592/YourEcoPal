import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { Container, Spinner } from "react-bootstrap";

const ProtectedRoute = ({ children, requireVerified = true }) => {
  const { isAuthenticated, isEmailVerified, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  
  if (requireVerified && !isEmailVerified) {
    return <Navigate to="/verify-email-notice" replace />;
  }

  return children;
};

export default ProtectedRoute;