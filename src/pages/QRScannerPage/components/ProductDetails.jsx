import React from 'react';

const ProductDetails = ({ product, loading, error, onAddToList }) => {
  if (loading) return (
    <div className="card">
      <div className="card-body text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading product data...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-danger">
      {error}
    </div>
  );
  
  if (!product) return null;

  const getScoreBadge = (score) => {
    if (!score) return null;
    
    const scoreClass = {
      'a': 'bg-success',
      'b': 'bg-success',
      'c': 'bg-warning',
      'd': 'bg-warning text-dark',
      'e': 'bg-danger'
    }[score.toLowerCase()] || 'bg-secondary';
    
    return (
      <span className={`badge ${scoreClass} fs-6 ms-2`}>
        {score.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="card">
      <div className="card-header bg-light">
        <h5 className="mb-0">Product Details</h5>
      </div>
      <div className="card-body">
        <div className="row">
          {product.image_url && (
            <div className="col-md-3 mb-3 text-center">
              <img 
                src={product.image_url} 
                alt={product.product_name}
                className="img-thumbnail" 
                style={{ maxHeight: '150px', objectFit: 'contain' }}
              />
            </div>
          )}
          
          <div className={product.image_url ? "col-md-9" : "col-12"}>
            <h5 className="card-title">{product.product_name || 'Unknown Product'}</h5>
            {product.brands && <p className="text-muted mb-2">{product.brands}</p>}
            
            <div className="mb-3">
              <div className="mb-2">
                <strong>Eco-Score:</strong> 
                {product.ecoscore_grade ? getScoreBadge(product.ecoscore_grade) : ' Not available'}
              </div>
              
              <div>
                <strong>Nutri-Score:</strong>
                {product.nutriscore_grade ? getScoreBadge(product.nutriscore_grade) : ' Not available'}
              </div>
            </div>
            
            <div className="mb-3">
              {product.categories && (
                <p className="mb-1"><small><strong>Categories:</strong> {product.categories}</small></p>
              )}
              {product.packaging && (
                <p className="mb-1"><small><strong>Packaging:</strong> {product.packaging}</small></p>
              )}
            </div>
            
            <div className="text-end">
              <button 
                className="btn btn-success" 
                onClick={onAddToList}
              >
                Add to Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;