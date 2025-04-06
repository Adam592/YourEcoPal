import { useState } from "react";
import { registerWithEmailAndPassword } from "../../../services/firebase/authService";

const useRegister = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const displayName = e.target.formDisplayName.value;
    const email = e.target.formEmail.value;
    const password = e.target.formPassword.value;
    const confirmPassword = e.target.formConfirmPassword.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await registerWithEmailAndPassword(email, password, displayName);
      setSuccess("Registration successful! Please check your email to verify your account.");
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please use a different email or try to login.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("Registration failed. Please try again later.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    success,
    loading,
    handleSubmit,
  };
};

export default useRegister;
