import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import useFetchProduct from './hooks/useFetchProduct';

const QRScannerPage = () => {
    const [barcode, setBarcode] = useState(null);
    const { product, loading, error } = useFetchProduct(barcode);

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

    return (
        <div>
            <h1>QR Scanner</h1>
            <BarcodeScannerComponent
                width={500}
                height={300}
                onUpdate={(err, result) => {
                    if (result) {
                        setBarcode(result.text); // Update barcode state
                    } else if (err) {
                        console.error('Error scanning:', err);
                    }
                }}
            />
            <p>Scanned Barcode: {barcode || 'No barcode scanned yet'}</p>

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
            </div>
        </div>
    );
};

export default QRScannerPage;