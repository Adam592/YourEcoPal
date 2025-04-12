import React from 'react';
import { useProductScanner } from './hooks/useProductScanner';
import { useCollections } from './hooks/useCollections';
import { useScannedProducts } from './hooks/useScannedProducts';

// Components
import ScanButton from './components/ScanButton';
import BarcodeScanner from './components/BarcodeScanner';
import ProductDetails from './components/ProductDetails';
import CollectionsTable from './components/CollectionsTable';
import CreateCollectionModal from './components/CreateCollectionModal';
import ListSelectionModal from './components/ListSelectionModal';

const QRScannerPage = () => {
  const { 
    barcode, 
    product, 
    loading, 
    error, 
    isPopupOpen, 
    openScanner, 
    closeScanner, 
    handleScan 
  } = useProductScanner();
  
  const {
    customCollections,
    newCollection,
    setNewCollection,
    isCreatePopupOpen,
    setIsCreatePopupOpen,
    expandedCollections,
    handleCreateCollection,
    toggleCollectionExpand
  } = useCollections();
  
  const {
    scannedProducts,
    isListSelectPopupOpen,
    setIsListSelectPopupOpen,
    selectedListId,
    setSelectedListId,
    saveProductToList,
    deleteProduct // Imported from the hook
  } = useScannedProducts();

  return (
    <div className="container py-4" style={{ backgroundColor: '#e8f5e9' }}>
      <h2 className="text-center text-success mb-4">Product Scanner</h2>
      
      {/* Collections Section */}
      <CollectionsTable 
        collections={customCollections}
        scannedProducts={scannedProducts}
        expandedCollections={expandedCollections}
        onToggleExpand={toggleCollectionExpand}
        onCreateNew={() => setIsCreatePopupOpen(true)}
        onDeleteProduct={deleteProduct} // Pass the delete function
      />
      
      {/* Scanner Section */}
      <div className="card mb-4 mt-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Scan Product</h5>
        </div>
        <div className="card-body text-center">
          <ScanButton onClick={openScanner} />
        </div>
      </div>

      {/* Product Details (only show when a product is scanned) */}
      {(product || loading || error) && (
        <div className="mt-3">
          <ProductDetails 
            product={product} 
            loading={loading} 
            error={error}
            onAddToList={() => setIsListSelectPopupOpen(true)}
          />
        </div>
      )}

      {/* Modals */}
      <BarcodeScanner 
        isOpen={isPopupOpen}
        onClose={closeScanner}
        onUpdate={(err, result) => {
          if (result) handleScan(result);
        }}
      />

      <CreateCollectionModal 
        isOpen={isCreatePopupOpen}
        onClose={() => setIsCreatePopupOpen(false)}
        onCreate={handleCreateCollection}
        collection={newCollection}
        onCollectionChange={setNewCollection}
      />

      <ListSelectionModal 
        isOpen={isListSelectPopupOpen}
        onClose={() => setIsListSelectPopupOpen(false)}
        onSave={() => saveProductToList(product, barcode)}
        collections={customCollections}
        selectedListId={selectedListId}
        onListSelect={setSelectedListId}
      />
    </div>
  );
};

export default QRScannerPage;