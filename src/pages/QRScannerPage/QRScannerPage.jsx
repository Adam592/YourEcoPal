import React, { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import ProductDetails from './components/ProductDetails';
import { Container, Row, Col } from 'react-bootstrap';

function ProductScannerPage() {
  const [scannedProduct, setScannedProduct] = useState(null);

  const handleProductScanned = (product) => {
    setScannedProduct(product);
  };

  return (
    <Container>
      <Row>
        <Col>
          <BarcodeScanner onProductScanned={handleProductScanned} />
        </Col>
        <Col>
          {scannedProduct && <ProductDetails product={scannedProduct} />}
        </Col>
      </Row>
    </Container>
  );
}
export default ProductScannerPage;