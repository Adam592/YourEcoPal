import React from 'react';

const ListSelectionModal = ({ isOpen, onClose, onSave, collections, selectedListId, onListSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select a Collection</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            {collections.length === 0 ? (
              <p className="text-center text-muted">No collections available. Please create a collection first.</p>
            ) : (
              <div className="list-group">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    className={`list-group-item list-group-item-action ${selectedListId === collection.id ? 'active' : ''}`}
                    onClick={() => onListSelect(collection.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{collection.name}</span>
                      <span className="badge bg-success rounded-pill">
                        {collection.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
              onClick={onSave}
              disabled={!selectedListId}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListSelectionModal;