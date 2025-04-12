import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../features/auth/context/AuthContext';
import useFetchProduct from './hooks/useFetchProduct';

const QRScannerPage = () => {
    const [barcode, setBarcode] = useState(null);
    const { product, loading, error } = useFetchProduct(barcode);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [customCollections, setCustomCollections] = useState([]);
    const [newCollection, setNewCollection] = useState({ name: '', type: '' });

    const db = getFirestore();
    const auth = useAuth();
    const user = auth.currentUser;

    // Extract eco-related information if the product is available
    const ecoInfo = product
        ? {
              ecoScore: product.ecoscore_grade || 'Unknown',
              ecoScoreScore: product.ecoscore_score || 'N/A',
              novaGroup: product.nova_group || 'N/A',
              packaging: product.packaging || 'N/A',
              carbonFootprint: product.carbon_footprint_per_100g || 'N/A',
              environmentImpactLevels: product.environment_impact_level_tags || [],
              palmOilIngredients: product.ingredients_from_palm_oil_n || 0,
              organicIngredients: product.ingredients_from_or_that_may_be_from_organic_agriculture_n || 0,
          }
        : null;

    useEffect(() => {
        const fetchUserDocument = async () => {
            if (user) {
                const userDocRef = doc(db, 'products', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (!userDocSnap.exists()) {
                    // Create a new document for the user
                    await setDoc(userDocRef, {
                        createdAt: new Date().toISOString(),
                        scannedProducts: [],
                        customCollections: [],
                    });
                    console.log('User document created in Firestore.');
                } else {
                    console.log('User document already exists.');
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
            const updatedCollections = [...customCollections, newCollection];

            await updateDoc(userDocRef, { customCollections: updatedCollections });
            setCustomCollections(updatedCollections);
            setNewCollection({ name: '', type: '' });
            setIsCreatePopupOpen(false);
            console.log('New collection added.');
        } catch (error) {
            console.error('Error adding collection:', error);
        }
    };

    return (
        <div>
            {/* Square container with a plus sign */}
            <div
                style={{
                    width: '100px',
                    height: '100px',
                    border: '2px dashed #000',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    margin: '20px auto',
                }}
                onClick={() => setIsPopupOpen(true)}
            >
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>+</span>
            </div>

            {/* Popup window for barcode scanning */}
            {isPopupOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <h2>Scan Barcode</h2>
                        <BarcodeScannerComponent
                            width={500}
                            height={300}
                            onUpdate={(err, result) => {
                                if (result) {
                                    setBarcode(result.text);
                                    setIsPopupOpen(false);
                                } else if (err) {
                                    console.error('Error scanning:', err);
                                }
                            }}
                        />
                        <button
                            style={{
                                marginTop: '10px',
                                padding: '10px 20px',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setIsPopupOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                {loading && <p>Loading product data...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {product && (
                    <div>
                        <h2>Product Details</h2>
                        <p><strong>Name:</strong> {product.product_name || 'N/A'}</p>
                        <p><strong>Brand:</strong> {product.brands || 'N/A'}</p>
                        <p><strong>Categories:</strong> {product.categories || 'N/A'}</p>
                        <p><strong>Ingredients:</strong> {product.ingredients_text || 'N/A'}</p>
                        
                        {/* Display eco-related information */}
                        <h2>Environmental Information</h2>
                        <p><strong>Eco-Score:</strong> {product.ecoscore_grade?.toUpperCase() || 'Unknown'}</p>
                        <p><strong>Nutri-Score:</strong> {product.nutriscore_grade?.toUpperCase() || 'Unknown'}</p>
                        <p><strong>Eco-Score (Score):</strong> {ecoInfo.ecoScoreScore}</p>
                        <p><strong>Nova Group:</strong> {ecoInfo.novaGroup}</p>
                        <p><strong>Packaging:</strong> {ecoInfo.packaging}</p>
                    </div>
                )}
                
                {/* Table for displaying custom collections */}
                <h2>Custom Collections</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customCollections.map((collection, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{collection.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{collection.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Button to open create collection popup */}
                <button
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsCreatePopupOpen(true)}
                >
                    Create New Collection
                </button>
            </div>

            {/* Popup for creating a new collection */}
            {isCreatePopupOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <h2>Create New Collection</h2>
                        <input
                            type="text"
                            placeholder="Collection Name"
                            value={newCollection.name}
                            onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                            style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                        />
                        <input
                            type="text"
                            placeholder="Collection Type"
                            value={newCollection.type}
                            onChange={(e) => setNewCollection({ ...newCollection, type: e.target.value })}
                            style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                        />
                        <button
                            style={{
                                marginRight: '10px',
                                padding: '10px 20px',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                            onClick={handleCreateCollection}
                        >
                            Create
                        </button>
                        <button
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setIsCreatePopupOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRScannerPage;