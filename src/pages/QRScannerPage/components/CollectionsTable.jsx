import React, { useEffect, useState } from 'react';

const CollectionsTable = ({ 
  collections, 
  scannedProducts, 
  expandedCollections, 
  onToggleExpand,
  onCreateNew,
  onDeleteProduct // Add this prop
}) => {
  const [processedProducts, setProcessedProducts] = useState([]);

  // Pre-process products from Firebase for better display
  useEffect(() => {
    if (!scannedProducts) return;
    
    // Transform Firebase data if needed
    const products = Array.isArray(scannedProducts) 
      ? scannedProducts 
      : Object.keys(scannedProducts || {}).map(key => ({
          id: key,
          ...scannedProducts[key]
        }));

    setProcessedProducts(products);
  }, [scannedProducts]);

  // Handle potential undefined collections
  const collectionsList = Array.isArray(collections) 
    ? collections 
    : Object.keys(collections || {}).map(key => ({
        id: key,
        ...collections[key]
      }));

  // Helper function to get color for eco score
  const getEcoScoreColor = (grade) => {
    if (!grade) return '#999'; // Default gray for unknown
    
    switch (grade.toLowerCase()) {
      case 'a': return '#1e8f4e'; // Green
      case 'b': return '#4d9f38'; // Light green
      case 'c': return '#e5b622'; // Yellow
      case 'd': return '#e36e15'; // Orange
      case 'e': return '#e82a1f'; // Red
      default: return '#999';     // Gray for unknown
    }
  };

  // Helper function to get color for nutri score
  const getNutriScoreColor = (grade) => {
    if (!grade) return '#999'; // Default gray for unknown
    
    switch (grade.toLowerCase()) {
      case 'a': return '#1e8f4e'; // Green
      case 'b': return '#4d9f38'; // Light green
      case 'c': return '#e5b622'; // Yellow
      case 'd': return '#e36e15'; // Orange
      case 'e': return '#e82a1f'; // Red
      default: return '#999';     // Gray for unknown
    }
  };

  // Function to handle delete button click
  const handleDelete = (e, productId) => {
    // Stop the event from bubbling up to parent elements
    e.stopPropagation();
    if (onDeleteProduct) {
      onDeleteProduct(productId);
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Your Collections</h5>
        <button 
          className="btn btn-success btn-sm" 
          onClick={onCreateNew}
        >
          + New
        </button>
      </div>
      <div className="card-body p-0">
        {!collectionsList || collectionsList.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">You don't have any collections yet</p>
            <button 
              className="btn btn-outline-success"
              onClick={onCreateNew}
            >
              Create your first collection
            </button>
          </div>
        ) : (
          <table className="table table-hover mb-0">
            <thead className="bg-success text-white">
              <tr>
                <th width="50"></th>
                <th>Collection</th>
                <th>Type</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {collectionsList.map(collection => {
                // Handle Firebase data structure
                const collectionId = collection.id || collection.key;
                // Change this line to use list_id instead of collectionId
                const collectionProducts = processedProducts.filter(p => p.list_id === collectionId);
                const itemCount = collectionProducts.length;
                
                // Check for expanded state from any data structure
                let isExpanded = false;
                
                if (expandedCollections === undefined) {
                  isExpanded = false;
                } else if (typeof expandedCollections === 'object' && !Array.isArray(expandedCollections)) {
                  isExpanded = !!expandedCollections[collectionId];
                } else if (Array.isArray(expandedCollections)) {
                  isExpanded = expandedCollections.includes(collectionId);
                }
                
                return (
                  <React.Fragment key={collectionId}>
                    <tr onClick={() => onToggleExpand(collectionId)}>
                      <td className="text-center">
                        {isExpanded ? '▼' : '>'}
                      </td>
                      <td>{collection.name}</td>
                      <td>{collection.type || 'No Type'}</td>
                      <td>{itemCount}</td>
                    </tr>
                    
                    {/* Display products when collection is expanded */}
                    {isExpanded && collectionProducts.length > 0 && 
                      collectionProducts.map(product => (
                        <tr key={`${collectionId}-${product.id || product.barcode}`} className="table-light">
                          <td></td>
                          <td colSpan="3" className="ps-4">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <span className="fw-medium">{product.name || product.product_name || 'Unknown Product'}</span>
                              </div>
                              
                              {/* Product info and delete button */}
                              <div className="d-flex align-items-center">
                                {/* Eco Score */}
                                <div className="me-3 d-flex align-items-center">
                                  <span className="me-2">Eco:</span>
                                  <span 
                                    className="badge rounded-pill" 
                                    style={{
                                      backgroundColor: getEcoScoreColor(product.ecoscore_grade),
                                      color: 'white',
                                      width: '24px',
                                      height: '24px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {(product.ecoscore_grade || '?').toUpperCase()}
                                  </span>
                                </div>
                                
                                {/* Nutri Score */}
                                <div className="d-flex align-items-center me-3">
                                  <span className="me-2">Nutri:</span>
                                  <span 
                                    className="badge rounded-pill" 
                                    style={{
                                      backgroundColor: getNutriScoreColor(product.nutriscore_grade),
                                      color: 'white',
                                      width: '24px',
                                      height: '24px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {(product.nutriscore_grade || '?').toUpperCase()}
                                  </span>
                                </div>
                                
                                {/* Delete button */}
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={(e) => handleDelete(e, product.id)}
                                  aria-label="Delete product"
                                >
                                  <i className="bi bi-trash"></i>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                    
                    {/* Show "No products" message if collection is empty */}
                    {isExpanded && collectionProducts.length === 0 && (
                      <tr className="table-light">
                        <td></td>
                        <td colSpan="3" className="text-center text-muted py-2">
                          No products in this collection
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CollectionsTable;