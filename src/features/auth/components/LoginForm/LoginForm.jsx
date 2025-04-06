import React from "react";
import { Form, Button } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const LoginForm = ({ onSubmit, onGoogleLogin }) => {
return (
    <>
        <Form onSubmit={onSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    required
                />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    minLength={6}
                    required
                />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 mb-3">
                Sign in
            </Button>
        </Form>

        <div className="text-center">or</div>

        <Button
            variant="outline-dark"
            className="w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
            onClick={onGoogleLogin}
        >
            <FcGoogle size={20} />
            Sign in with Google
        </Button>

        <div className="mt-3 text-center">
            <Link to="/register">Create an account</Link>
        </div>
        <div className="mt-2 text-center">
            <Link to="/reset-password">Forgot your password?</Link>
        </div>
    </>
);
};

export default LoginForm;
