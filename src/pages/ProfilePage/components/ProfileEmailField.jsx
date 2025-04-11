import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FiMail, FiEdit, FiSave } from "react-icons/fi";
import { useProfileEmailUpdate } from "../hooks/useUserProfileData";

const ProfileEmailField = ({ initialEmail, onUpdateSuccess }) => {
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState(initialEmail || "");
  const { updateUserEmailAddress, updating, error } = useProfileEmailUpdate();

  const handleSave = async () => {
    const success = await updateUserEmailAddress(email);
    if (success) {
      setEditMode(false);
      if (onUpdateSuccess) onUpdateSuccess("Email updated successfully");
    }
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label className="fw-bold">
        <FiMail className="me-2" />Email
      </Form.Label>
      <div className="d-flex">
        {editMode ? (
          <>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type="email"
              value={email}
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
export default ProfileEmailField;