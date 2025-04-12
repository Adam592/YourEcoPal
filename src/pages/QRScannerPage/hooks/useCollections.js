import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../../features/auth/context/AuthContext';

export const useCollections = () => {
  const [customCollections, setCustomCollections] = useState([]);
  const [newCollection, setNewCollection] = useState({ name: '', type: '' });
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [expandedCollections, setExpandedCollections] = useState({});
  
  const db = getFirestore();
  const auth = useAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserDocument = async () => {
      if (user) {
        const userDocRef = doc(db, 'products', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            createdAt: new Date().toISOString(),
            scannedProducts: [],
            customCollections: [],
          });
        } else {
          const data = userDocSnap.data();
          setCustomCollections(data.customCollections || []);
        }
      }
    };

    fetchUserDocument();
  }, [user, db]);

  const handleCreateCollection = async () => {
    if (!newCollection.name || !newCollection.type) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      const userDocRef = doc(db, 'products', user.uid);
      const collectionWithId = {
        ...newCollection,
        id: uuidv4()
      };
      const updatedCollections = [...customCollections, collectionWithId];

      await updateDoc(userDocRef, { customCollections: updatedCollections });
      setCustomCollections(updatedCollections);
      setNewCollection({ name: '', type: '' });
      setIsCreatePopupOpen(false);
    } catch (error) {
      console.error('Error adding collection:', error);
    }
  };

  const toggleCollectionExpand = (collectionId) => {
    setExpandedCollections(prev => ({
      ...prev,
      [collectionId]: !prev[collectionId]
    }));
  };

  return {
    customCollections,
    newCollection,
    setNewCollection,
    isCreatePopupOpen,
    setIsCreatePopupOpen,
    expandedCollections,
    handleCreateCollection,
    toggleCollectionExpand
  };
};