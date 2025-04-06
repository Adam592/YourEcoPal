import { useState } from 'react';
import { sendVerificationEmail } from '../../../services/firebase/authService';

const useResendVerification = () => { 
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleResendVerification = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      await sendVerificationEmail();
      setSuccess("We've sent another verification email. Please check your inbox.");
    } catch (err) {
      setError("Failed to send verification email. Please try again later.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, error, success, handleResendVerification };
};

export default useResendVerification;
