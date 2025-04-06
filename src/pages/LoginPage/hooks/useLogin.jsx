import { useState } from "react";
import { loginWithEmailAndPassword, signInWithGoogle } from "../../../services/firebase/authService";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = e.target.formEmail.value;
    const password = e.target.formPassword.value;

    try {
      const user = await loginWithEmailAndPassword(email, password);

      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        setLoading(false);
        return;
      }

      navigate("/dashboard"); 
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      console.log("Zalogowano przez Google:", user);
      navigate("/dashboard");
    } catch (err) {
      setError("An error occurred during Google login.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    handleSubmit,
    handleGoogleLogin,
  };
};

export default useLogin;
