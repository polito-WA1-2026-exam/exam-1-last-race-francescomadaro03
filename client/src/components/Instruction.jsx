import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Instruction = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Agent 7677 Dossier - Operational Instructions</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <h5 className="text-danger fw-bold mb-3">Operational Background</h5>
        <p>
          Year 2042. The Central Government has imposed total control over communications. 
          The internet is blocked, phone lines are wiretapped, and every radio frequency is tracked by surveillance drones. 
          The <strong>Resistance</strong>, fighting for a decade to restore freedom, has been forced back to the past: the only safe way to exchange vital information is through hand delivery in the dark shadows of the underground train network.
        </p>
        <p>
          You are <strong>Agent 7677</strong>, the newest recruit. 
          Your task is vital: you must move swiftly through the city to deliver secret messages between outposts. 
          In the field, you won't have digital devices or interactive maps to help you avoid being tracked; your only true survival weapon will be your <strong>memory</strong> and your knowledge of the underground network.
        </p>

        <hr className="my-4" />

        <h5 className="text-primary fw-bold mb-3">How to play</h5>
        <ul className="mb-4">
          <li className="mb-2">At the start of the mission you will be assigned a <strong>Departure</strong> station and an <strong>Arrival</strong> station.</li>
          <li className="mb-2">You must reconstruct the entire route by selecting the correct intermediate stops in chronological order.</li>
          <li className="mb-2">Pay close attention to <strong>interchange hubs</strong> if you need to jump from one line to another!</li>
          <li className="mb-2">Press Confirm only when you are absolutely sure of the route. If you make a mistake, you will be intercepted by the Government and the mission will fail.</li>
        </ul>
        <div className="alert alert-warning border-start border-warning border-4" role="alert">
          <em>Remember: the survival of the Resistance is in your hands. Be swift and invisible.</em>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close Dossier
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Instruction;
