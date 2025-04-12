import React from 'react';
import { Table } from 'react-bootstrap';
import useCO2Calculator from '../hooks/useCO2Calculator';

const PastJourneysTable = ({ journeys }) => {
  const { calculateCO2Saved } = useCO2Calculator();

  return (
    <>
      <h4 className="text-center mb-3">Past Journeys</h4>
      <div className="mb-3 table-responsive">
        <Table className="border">
          <thead className="bg-success text-white">
            <tr>
              <th>Date</th>
              <th>Transport</th>
              <th>Distance</th>
              <th>CO₂ Saved</th>
            </tr>
          </thead>
          <tbody>
            {journeys.length > 0 ? (
              journeys.slice(0, 3).map((journey) => (
                <tr key={journey.id}>
                  <td>{new Date(journey.timestamp.toDate()).toLocaleDateString()}</td>
                  <td>{journey.transportMode.charAt(0).toUpperCase() + journey.transportMode.slice(1)}</td>
                  <td>{journey.distance} km</td>
                  <td>{journey.co2Saved || calculateCO2Saved(journey.transportMode, parseFloat(journey.distance))} kg</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No journeys recorded</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default PastJourneysTable;