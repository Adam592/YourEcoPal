import React, { useState } from "react";
import { Form, Button, InputGroup} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleConfirmPasswordChange = (e) => {
    const password = e.target.form.password.value;
    const confirmPassword = e.target.value;
    setPasswordMatch(password === confirmPassword || confirmPassword === '');
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formDisplayName" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            name="displayName"
            required
          />
          <Form.Text className="text-muted">
            This name will be displayed to other users.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            required
          />
          <Form.Text className="text-muted">
            We'll send a verification link to this email.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              name="password"
              minLength={6}
              required
            />
            <Button 
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
          <Form.Text className="text-muted">
            Password must be at least 6 characters long.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formConfirmPassword" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              name="confirmPassword"
              minLength={6}
              required
              onChange={handleConfirmPasswordChange}
              isInvalid={!passwordMatch}
            />
            <Button 
              variant="outline-secondary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
            <Form.Control.Feedback type="invalid">
              Passwords do not match.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Button variant="success" type="submit" className="w-100 mb-3">
          Register
        </Button>
      </Form>

      <Button variant="link" as={Link} to="/login">
        Already have an account?
      </Button>
    </>
  );
};

export default RegisterForm;
