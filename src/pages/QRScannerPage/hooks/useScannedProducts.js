import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../../features/auth/context/AuthContext';

export const useScannedProducts = () => {
  const [scannedProducts, setScannedProducts] = useState([]);
  const [isListSelectPopupOpen, setIsListSelectPopupOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);
  
  const db = getFirestore();
  const auth = useAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchScannedProducts = async () => {
      if (user) {
        const userDocRef = doc(db, 'products', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setScannedProducts(data.scannedProducts || []);
        }
      }
    };

    fetchScannedProducts();
  }, [user, db]);

  const saveProductToList = async (product, barcode) => {
    if (!selectedListId || !product) return;
    
    try {
      const userDocRef = doc(db, 'products', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const existingProducts = userData.scannedProducts || [];
        
        // Create a clean product object with only the necessary fields
        const cleanProduct = {
          product_name: product.product_name || 'N/A',
          brands: product.brands || 'N/A',
          categories: product.categories || 'N/A',
          image_url: product.image_url || 'N/A',
          ecoscore_grade: product.ecoscore_grade || 'N/A',
          nutriscore_grade: product.nutriscore_grade || 'N/A',
          ecoscore_score: product.ecoscore_score || 'N/A',
          nova_group: product.nova_group || 'N/A',
          ingredients_text: product.ingredients_text || 'N/A',
        };
        
        // Create product entry with list_id
        const productEntry = {
          ...cleanProduct,
          list_id: selectedListId,
          added_at: new Date().toISOString(),
          barcode: barcode,
          id: uuidv4(),
        };
        
        const updatedProducts = [...existingProducts, productEntry];
        
        await updateDoc(userDocRef, { 
          scannedProducts: updatedProducts 
        });

        setScannedProducts(updatedProducts);
        setIsListSelectPopupOpen(false);
        setSelectedListId(null);
      } else {
        await setDoc(userDocRef, {
          scannedProducts: [{
            product_name: product.product_name || 'N/A',
            brands: product.brands || 'N/A',
            categories: product.categories || 'N/A',
            image_url: product.image_url || 'N/A',
            ecoscore_grade: product.ecoscore_grade || 'N/A',
            nutriscore_grade: product.nutriscore_grade || 'N/A',
            barcode: barcode,
            list_id: selectedListId,
            added_at: new Date().toISOString(),
            id: uuidv4(),
          }],
          customCollections: [],
          createdAt: new Date().toISOString(),
        });
        
        setIsListSelectPopupOpen(false);
        setSelectedListId(null);
      }
    } catch (error) {
      console.error('Error saving product to list:', error);
    }
  };

  // Add the delete product function
  const deleteProduct = async (productId) => {
    if (!user || !productId) return;

    try {
      const userDocRef = doc(db, 'products', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const existingProducts = userData.scannedProducts || [];
        
        // Filter out the product with the matching ID
        const updatedProducts = existingProducts.filter(product => product.id !== productId);
        
        // Update Firestore
        await updateDoc(userDocRef, { 
          scannedProducts: updatedProducts 
        });

        // Update local state
        setScannedProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return {
    scannedProducts,
    isListSelectPopupOpen,
    setIsListSelectPopupOpen,
    selectedListId,
    setSelectedListId,
    saveProductToList,
    deleteProduct // Export the new function
  };
};