import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FiUser, FiEdit, FiSave } from "react-icons/fi";
import { useProfileNameUpdate } from "./../hooks/useUserProfileData";

const ProfileNameField = ({ initialName, onUpdateSuccess }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(initialName || "");
  const { updateName, updating, error } = useProfileNameUpdate();

  const handleSave = async () => {
    const success = await updateName(name);
    if (success) {
      setEditMode(false);
      if (onUpdateSuccess) onUpdateSuccess("Name updated successfully");
    }
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label className="fw-bold">
        <FiUser className="me-2" />Name
      </Form.Label>
      <div className="d-flex">
        {editMode ? (
          <>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updating}
            />
            <Button 
              variant="success" 
              className="ms-2" 
              onClick={handleSave}
              disabled={updating}
            >
              <FiSave />
            </Button>
          </>
        ) : (
          <>
            <Form.Control
              type="text"
              value={name}
              readOnly
              className="bg-light"
            />
            <Button 
              variant="outline-success" 
              className="ms-2" 
              onClick={() => setEditMode(true)}
            >
              <FiEdit />
            </Button>
          </>
        )}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </Form.Group>
  );
};

export default ProfileNameField;