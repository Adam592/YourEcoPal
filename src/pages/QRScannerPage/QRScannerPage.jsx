import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../features/auth/context/AuthContext';
import useFetchProduct from './hooks/useFetchProduct';
import { v4 as uuidv4 } from 'uuid'; // Add this import for generating unique IDs

const QRScannerPage = () => {
    const [barcode, setBarcode] = useState(null);
    const { product, loading, error } = useFetchProduct(barcode);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [isListSelectPopupOpen, setIsListSelectPopupOpen] = useState(false); // New state for list selection popup
    const [customCollections, setCustomCollections] = useState([]);
    const [newCollection, setNewCollection] = useState({ name: '', type: '' });
    const [selectedListId, setSelectedListId] = useState(null); // New state for selected list ID
    const [expandedCollections, setExpandedCollections] = useState({}); // Add this with your other state declarations
    const [scannedProducts, setScannedProducts] = useState([]); // Add with other state declarations

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
                    setScannedProducts(data.scannedProducts || []);
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
            // Add a unique ID to the new collection
            const collectionWithId = {
                ...newCollection,
                id: uuidv4() // Generate a unique ID
            };
            const updatedCollections = [...customCollections, collectionWithId];

            await updateDoc(userDocRef, { customCollections: updatedCollections });
            setCustomCollections(updatedCollections);
            setNewCollection({ name: '', type: '' });
            setIsCreatePopupOpen(false);
            console.log('New collection added.');
        } catch (error) {
            console.error('Error adding collection:', error);
        }
    };

    const saveProductToList = async () => {
        if (!selectedListId || !product) return;
        
        try {
            const userDocRef = doc(db, 'products', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const scannedProducts = userData.scannedProducts || [];
                
                // Create a clean product object with only the necessary fields
                const cleanProduct = {
                    product_name: product.product_name || 'N/A',
                    brands: product.brands || 'N/A',
                    categories: product.categories || 'N/A',
                    image_url: product.image_url || null,
                    ecoscore_grade: product.ecoscore_grade || null,
                    nutriscore_grade: product.nutriscore_grade || null,
                    ecoscore_score: product.ecoscore_score || null,
                    nova_group: product.nova_group || null,
                    ingredients_text: product.ingredients_text || null,
                };
                
                // Create product entry with list_id
                const productEntry = {
                    ...cleanProduct,
                    list_id: selectedListId,
                    added_at: new Date().toISOString(),
                    barcode: barcode,
                    id: uuidv4(), // Add a unique ID to each scanned product
                };
                
                const updatedProducts = [...scannedProducts, productEntry];
                
                await updateDoc(userDocRef, { 
                    scannedProducts: updatedProducts 
                });

                // Update local state
                setScannedProducts(updatedProducts);
                
                // Verify the update was successful by fetching the document again
                const verifyDocSnap = await getDoc(userDocRef);
                if (verifyDocSnap.exists()) {
                    const verifyData = verifyDocSnap.data();
                    console.log('Updated scannedProducts count:', verifyData.scannedProducts?.length || 0);
                }
                
                alert('Product added to collection successfully!');
                setIsListSelectPopupOpen(false);
                setSelectedListId(null);
            } else {
                console.error('User document not found. Creating new document.');
                // If document doesn't exist, create it
                await setDoc(userDocRef, {
                    scannedProducts: [{
                        product_name: product.product_name || 'N/A',
                        brands: product.brands || 'N/A',
                        categories: product.categories || 'N/A',
                        image_url: product.image_url || null,
                        ecoscore_grade: product.ecoscore_grade || null,
                        nutriscore_grade: product.nutriscore_grade || null,
                        barcode: barcode,
                        list_id: selectedListId,
                        added_at: new Date().toISOString(),
                        id: uuidv4(),
                    }],
                    customCollections: customCollections,
                    createdAt: new Date().toISOString(),
                });
                
                alert('Product added to collection successfully!');
                setIsListSelectPopupOpen(false);
                setSelectedListId(null);
            }
        } catch (error) {
            console.error('Error saving product to list:', error);
            alert('Failed to save product to collection. Please try again.');
        }
    };

    const toggleCollectionExpand = (collectionId) => {
        setExpandedCollections(prev => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }));
    };

    const getEcoScoreColor = (grade) => {
        switch (grade.toLowerCase()) {
            case 'a': return '#4CAF50';
            case 'b': return '#8BC34A';
            case 'c': return '#FFC107';
            case 'd': return '#FF5722';
            case 'e': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    const getNutriScoreColor = (grade) => {
        switch (grade.toLowerCase()) {
            case 'a': return '#4CAF50';
            case 'b': return '#8BC34A';
            case 'c': return '#FFC107';
            case 'd': return '#FF5722';
            case 'e': return '#F44336';
            default: return '#9E9E9E';
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

                        {/* Add to list button */}
                        <button
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#2196F3',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setIsListSelectPopupOpen(true)}
                        >
                            Add to List
                        </button>
                    </div>
                )}
                
                {/* Table for displaying custom collections */}
                <h2>Custom Collections</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customCollections.map((collection, index) => {
                            // Get products that belong to this collection
                            const collectionProducts = scannedProducts.filter(
                                product => product.list_id === collection.id
                            );
                            const isExpanded = expandedCollections[collection.id] || false;
                            
                            return (
                                <React.Fragment key={collection.id}>
                                    <tr>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{collection.name}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{collection.type}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{collection.id}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            <button 
                                                onClick={() => toggleCollectionExpand(collection.id)}
                                                style={{
                                                    padding: '5px 10px',
                                                    backgroundColor: '#2196F3',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '100%'
                                                }}
                                            >
                                                {isExpanded ? 'Hide Products' : `Show Products (${collectionProducts.length})`}
                                            </button>
                                        </td>
                                    </tr>
                                    {isExpanded && collectionProducts.length > 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '0' }}>
                                                <div style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
                                                    <h4 style={{ marginTop: '0' }}>Products in {collection.name}</h4>
                                                    <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                                                        {collectionProducts.map(product => (
                                                            <li 
                                                                key={product.id} 
                                                                style={{ 
                                                                    padding: '8px', 
                                                                    margin: '5px 0',
                                                                    border: '1px solid #ddd',
                                                                    borderRadius: '4px',
                                                                    backgroundColor: '#fff',
                                                                    display: 'flex',
                                                                    alignItems: 'center' 
                                                                }}
                                                            >
                                                                {product.image_url && (
                                                                    <img 
                                                                        src={product.image_url} 
                                                                        alt={product.product_name}
                                                                        style={{ 
                                                                            width: '50px',
                                                                            height: '50px',
                                                                            marginRight: '10px',
                                                                            objectFit: 'contain'
                                                                        }} 
                                                                    />
                                                                )}
                                                                <div>
                                                                    <strong>{product.product_name}</strong>
                                                                    {product.brands && <div>{product.brands}</div>}
                                                                    <div style={{ 
                                                                        display: 'flex',
                                                                        gap: '10px',
                                                                        marginTop: '5px'
                                                                    }}>
                                                                        {product.ecoscore_grade && (
                                                                            <span style={{ 
                                                                                padding: '2px 6px', 
                                                                                backgroundColor: getEcoScoreColor(product.ecoscore_grade),
                                                                                color: '#fff',
                                                                                borderRadius: '3px',
                                                                                fontSize: '0.8rem' 
                                                                            }}>
                                                                                Eco: {product.ecoscore_grade.toUpperCase()}
                                                                            </span>
                                                                        )}
                                                                        {product.nutriscore_grade && (
                                                                            <span style={{ 
                                                                                padding: '2px 6px', 
                                                                                backgroundColor: getNutriScoreColor(product.nutriscore_grade),
                                                                                color: '#fff',
                                                                                borderRadius: '3px',
                                                                                fontSize: '0.8rem' 
                                                                            }}>
                                                                                Nutri: {product.nutriscore_grade.toUpperCase()}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {isExpanded && collectionProducts.length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
                                                <p style={{ margin: '0', textAlign: 'center', fontStyle: 'italic' }}>
                                                    No products in this collection yet.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
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

            {/* New popup for selecting a collection */}
            {isListSelectPopupOpen && product && (
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
                            maxWidth: '500px',
                            width: '90%',
                        }}
                    >
                        <h2>Select a Collection</h2>
                        {customCollections.length === 0 ? (
                            <p>No collections available. Please create a collection first.</p>
                        ) : (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {customCollections.map((collection) => (
                                    <div 
                                        key={collection.id} 
                                        style={{
                                            padding: '10px',
                                            margin: '5px 0',
                                            border: selectedListId === collection.id ? '2px solid #2196F3' : '1px solid #ddd',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            backgroundColor: selectedListId === collection.id ? '#e3f2fd' : 'transparent',
                                        }}
                                        onClick={() => setSelectedListId(collection.id)}
                                    >
                                        <strong>{collection.name}</strong> ({collection.type})
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                style={{
                                    marginRight: '10px',
                                    padding: '10px 20px',
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    opacity: selectedListId ? 1 : 0.5,
                                }}
                                onClick={saveProductToList}
                                disabled={!selectedListId}
                            >
                                Save
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
                                onClick={() => setIsListSelectPopupOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRScannerPage;