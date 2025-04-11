import { useState, useEffect } from 'react';

const useFetchProduct = (barcode) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!barcode) return;

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
                const data = await response.json();

                if (data.status === 1) {
                    setProduct(data.product); // Product found
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to fetch product data');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [barcode]);

    return { product, loading, error };
};

export default useFetchProduct;