import React, { createContext, useContext, useState, useEffect } from "react";
import { firebaseAuth } from "../../../services/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshUserStatus = async () => {
    if (firebaseAuth.currentUser) {
      try {
        await firebaseAuth.currentUser.reload();
        setCurrentUser(firebaseAuth.currentUser);
      } catch (error) {
        console.error("Error refreshing user:", error);
      }
    } 
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isEmailVerified: currentUser?.emailVerified || false,
    refreshUserStatus,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Ładowanie...</div>}
    </AuthContext.Provider>
  );
};