import { useState, useEffect } from 'react';
import { confirmEmailVerification } from '../../../services/firebase/authService';
import { saveUserData } from '../../../services/firebase/userService';

const useEmailVerification = (oobCode, mode, refreshUserStatus, currentUser) => {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const processVerification = async () => {
      if (mode === 'verifyEmail' && oobCode) { 
        setVerifying(true);
        setError(null);
        setSuccess(null);

        try {
          const verificationResult = await confirmEmailVerification(oobCode);

          if (verificationResult) {
            await refreshUserStatus();

            if (currentUser && currentUser.emailVerified) {
              await saveUserData(currentUser.uid, currentUser.email, currentUser.displayName, currentUser.photoURL);
              setSuccess("Your email has been verified successfully!");
            } else {
              setError("Email verification successful, but emailVerified flag not updated yet. Please refresh.");
            }
          } else {
            setError("We couldn't verify your email.");
          }
        } catch (err) {
          console.error("Email verification failed:", err.message, err.code);
          setError(`We couldn't verify your email: ${err.message}`);
        } finally {
          setVerifying(false);
        }
      }
    };

    processVerification();
  }, [mode, oobCode, refreshUserStatus, currentUser]);

  return { verifying, error, success };
};

export default useEmailVerification;
