import { useState } from 'react';
import { logout } from '../../../services/firebase/authService';
import { useNavigate } from 'react-router-dom';

const useNavigateToSignIn = (currentUser) => {
  const [,setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleGoToLogin = async () => {
    setIsProcessing(true);

    try {
      if (currentUser) {
        await logout();
      }

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Error during redirect:", err);
      setIsProcessing(false);
    }
  };

  return { handleGoToLogin };
};

export default useNavigateToSignIn;
