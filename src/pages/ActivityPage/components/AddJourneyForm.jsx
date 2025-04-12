import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const AddJourneyForm = ({ onStartJourney }) => {
  return (
    <Form>
      <div className="text-center">
        <Button 
          variant="success"
          onClick={onStartJourney}
          className="px-5"
        >
          START
        </Button>
      </div>
    </Form>
  );
};

export default AddJourneyForm;