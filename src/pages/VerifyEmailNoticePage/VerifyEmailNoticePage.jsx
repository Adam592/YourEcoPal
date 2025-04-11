import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card } from "react-bootstrap";
import { useAuth } from '../../features/auth/context/AuthContext';
import useEmailVerification from './hooks/useEmailVerification';
import useNavigateToSignIn from './hooks/useNavigateToSignIn';
import useRenderContent from './hooks/useRenderContent';


const VerifyEmailNoticePage = () => {
    const location = useLocation();
    const { currentUser, refreshUserStatus } = useAuth();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const oobCode = queryParams.get('oobCode');

    const { verifying, error, success } = useEmailVerification(oobCode, mode, refreshUserStatus, currentUser);
    const { handleGoToLogin } = useNavigateToSignIn(currentUser);

    const renderContent = useRenderContent(
        verifying, 
        error, 
        success, 
        mode, 
        handleGoToLogin, 
        
      );

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Row>
            <Col>
            <Card className="p-4 shadow-lg rounded-4" style={{ maxWidth: "500px" }}>
                <Card.Body>
                <h3 className="text-center mb-4">Email Verification</h3>
                {renderContent}
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    );
};

export default VerifyEmailNoticePage;
