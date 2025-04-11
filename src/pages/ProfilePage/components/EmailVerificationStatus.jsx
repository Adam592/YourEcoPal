import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { FiCheck } from "react-icons/fi";
import { sendVerificationEmail } from "../../../services/firebase/authService";

const EmailVerificationStatus = ({ isVerified, onSuccess, onError }) => {
  const [sending, setSending] = useState(false);

  const handleSendVerification = async () => {
    try {
      setSending(true);
      await sendVerificationEmail();
      if (onSuccess) onSuccess("Verification email sent!");
    } catch (err) {
      if (onError) onError("Failed to send verification email: " + err.message);
    } finally {
      setSending(false);
    }
  };

  if (isVerified) {
    return (
      <Alert variant="success" className="mb-4">
        <FiCheck className="me-2" />Your email is verified
      </Alert>
    );
  }

  return (
    <Alert variant="warning" className="mb-4">
      Your email is not verified. 
      <Button 
        variant="link" 
        className="p-0 ms-2 text-success"
        onClick={handleSendVerification}
        disabled={sending}
      >
        {sending ? "Sending..." : "Send verification email"}
      </Button>
    </Alert>
  );
};
export default EmailVerificationStatus;