// hooks/useUserProfile.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { getUserData, updateUserName, updateUserEmail } from '../../../services/firebase/userService';
import { updateProfile, updateEmail } from "firebase/auth";
import { firebaseAuth } from "../../../services/firebase/firebaseConfig";

export const useUserProfileData = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return { userData, loading, error };
};

export const useProfileNameUpdate = () => {
  const { currentUser, refreshUserStatus } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateName = async (name) => {
    if (!currentUser || !name.trim()) {
      setError('Name cannot be empty');
      return false;
    }

    setUpdating(true);
    setError(null);

    try {
      await updateProfile(firebaseAuth.currentUser, { displayName: name });

      await updateUserName(currentUser.uid, name);
      
      await refreshUserStatus();
      return true;
    } catch (err) {
      setError(`Failed to update name: ${err.message}`);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { updateName, updating, error };
};

export const useProfileEmailUpdate = () => {
  const { currentUser, refreshUserStatus } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateUserEmailAddress = async (email) => {
    if (!currentUser || !email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }

    setUpdating(true);
    setError(null);

    try {
      await updateEmail(firebaseAuth.currentUser, email);
      
      await updateUserEmail(currentUser.uid, email);
      
      await refreshUserStatus();
      return true;
    } catch (err) {
      setError(`Failed to update email: ${err.message}`);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { updateUserEmailAddress, updating, error };
};
