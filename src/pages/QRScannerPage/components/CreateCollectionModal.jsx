import React from 'react';

const CreateCollectionModal = ({ isOpen, onClose, onCreate, collection, onCollectionChange }) => {
  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Collection</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="collectionName" className="form-label">Collection Name</label>
              <input
                type="text"
                className="form-control"
                id="collectionName"
                placeholder="e.g. Bathroom Products"
                value={collection.name}
                onChange={(e) => onCollectionChange({ ...collection, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="collectionType" className="form-label">Collection Type</label>
              <input
                type="text"
                className="form-control"
                id="collectionType"
                placeholder="e.g. Personal Care"
                value={collection.type}
                onChange={(e) => onCollectionChange({ ...collection, type: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={onCreate}
              disabled={!collection.name || !collection.type}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionModal;