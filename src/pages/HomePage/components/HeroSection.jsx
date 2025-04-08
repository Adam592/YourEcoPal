import React from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Button } from 'react-bootstrap';
const HeroSection = () => {
    const navigate = useNavigate();
    
    return (
        <Container className="px-4 py-5 my-4 text-center">
            <h1 className="display-5 fw-bold text-body-emphasis">Welcome to YourEcoPal</h1>
            <div className="col-lg-8 mx-auto">
            <p className="lead mb-4">
                YourEcoPal empowers you to make eco-friendly decisions by tracking your daily activities and purchases.
                Gain insights into your carbon footprint and discover practical ways to reduce your environmental impact.
            </p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <Button
                variant="success"
                size="lg"
                className="px-4"
                onClick={() => navigate("/login")}
                >
                Get Started Now
                </Button>
            </div>
            </div>
        </Container>
    );
};

export default HeroSection;
