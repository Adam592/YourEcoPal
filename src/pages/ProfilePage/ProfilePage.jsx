import React, { useState } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useUserProfileData } from "./hooks/useUserProfileData";
import ProfilePhoto from "./components/ProfilePhoto";
import ProfileNameField from "./components/ProfileNameField";
import ProfileEmailField from "./components/ProfileEmailField";
import EmailVerificationStatus from "./components/EmailVerificationStatus";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { userData, loading } = useUserProfileData();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSuccess = (message) => {
    setSuccess(message);
    setError("");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleError = (message) => {
    setError(message);
    setSuccess("");
  };

  if (loading) {
    return <div className="text-center p-5">Loading profile...</div>;
  }

  return (
    <Container className="py-5">
      <Card className="shadow">
        <Card.Header as="h4" className="bg-success text-white">
          <FiUser className="me-2" />User Profile
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <ProfilePhoto photoURL={currentUser?.photoURL} />

          <Row className="mb-3">
            <Col md={6} className="mx-auto">
              <ProfileNameField 
                initialName={currentUser?.displayName || userData?.name || ""} 
                onUpdateSuccess={handleSuccess}
              />

              <ProfileEmailField 
                initialEmail={currentUser?.email || userData?.email || ""} 
                onUpdateSuccess={handleSuccess}
              />

              <EmailVerificationStatus 
                isVerified={currentUser?.emailVerified} 
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;