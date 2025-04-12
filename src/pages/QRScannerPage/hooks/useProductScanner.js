import { useState } from 'react';
import useFetchProduct from './useFetchProduct';

export const useProductScanner = () => {
  const [barcode, setBarcode] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { product, loading, error } = useFetchProduct(barcode);

  const openScanner = () => setIsPopupOpen(true);
  const closeScanner = () => setIsPopupOpen(false);
  const handleScan = (result) => {
    if (result) {
      setBarcode(result.text);
      closeScanner();
    }
  };

  return {
    barcode,
    product,
    loading,
    error,
    isPopupOpen,
    openScanner,
    closeScanner,
    handleScan,
  };
};