import { useState, useEffect, useCallback } from 'react';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import useCO2Calculator from './useCO2Calculator';

const useJourneys = (currentUser) => {
  const [completedJourneys, setCompletedJourneys] = useState([]);
  const { calculateCO2Saved } = useCO2Calculator();

  const checkAndCreateUserDocument = useCallback(async (userId) => {
    const db = getFirestore();
    const userDocRef = doc(db, "journeys", userId);

    try {
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error checking or creating document:", error);
    }
  }, []);

  const fetchCompletedJourneys = useCallback(async (userId) => {
    const db = getFirestore();
    const journeysCollectionRef = collection(db, "journeys", userId, "users_journeys");

    try {
      const querySnapshot = await getDocs(journeysCollectionRef);
      const journeys = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompletedJourneys(journeys);
    } catch (error) {
      console.error("Error fetching completed journeys:", error);
    }
  }, []);

  const saveCompletedJourney = useCallback(async (userId, journey) => {
    const db = getFirestore();
    const journeysCollectionRef = collection(db, "journeys", userId, "users_journeys");

    try {
      // Calculate CO2 saved for this journey
      const co2Saved = calculateCO2Saved(journey.transportMode, parseFloat(journey.distance));
      
      // Add CO2 saved to journey data
      const journeyWithCO2 = {
        ...journey,
        co2Saved
      };
      
      await addDoc(journeysCollectionRef, journeyWithCO2);
      fetchCompletedJourneys(userId);
    } catch (error) {
      console.error("Error saving journey:", error);
    }
  }, [calculateCO2Saved, fetchCompletedJourneys]);

  // Initialize and load journeys when user changes
  useEffect(() => {
    if (currentUser?.uid) {
      checkAndCreateUserDocument(currentUser.uid);
      fetchCompletedJourneys(currentUser.uid);
    }
  }, [currentUser, checkAndCreateUserDocument, fetchCompletedJourneys]);

  return {
    completedJourneys,
    saveCompletedJourney,
  };
};

export default useJourneys;