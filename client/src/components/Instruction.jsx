import React from 'react';
import { Modal } from 'react-bootstrap';
import PaperTemplate from './PaperTemplate';
import ButtonComponent from './ButtonComponent';

const Instruction = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered contentClassName="bg-transparent border-0 shadow-none">
      <PaperTemplate
        className="p-4 shadow-lg"
        headerTitle="THE AGENCY"
        headerStatus="[ OPERATIONAL INSTRUCTIONS ]"
        style={{ transform: 'rotate(0.5deg)' }}
      >
        <div className="d-flex justify-content-between align-items-start mb-4">
          <h3 className="fw-bold m-0 text-uppercase" style={{ letterSpacing: '1px' }}>Agent 7677 Dossier</h3>
          <button onClick={handleClose} className="btn-close" aria-label="Close" style={{ filter: 'grayscale(100%) opacity(0.8)' }}></button>
        </div>

        <h5 className="fw-bold mb-3 text-uppercase" style={{ color: 'var(--quinary, #8b0000)' }}>Operational Background</h5>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
          Year 2042. The Central Government has imposed total control over communications.
          The internet is blocked, phone lines are wiretapped, and every radio frequency is tracked by surveillance drones.
          The <strong>Agency</strong>, fighting for a decade to restore freedom, has been forced back to the past: the only safe way to exchange vital information is through hand delivery in the dark shadows of the underground train network.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
          You are <strong>Agent 7677</strong>, the newest recruit.
          Your task is vital: you must move swiftly through the city to deliver secret messages between outposts.
          In the field, you won't have digital devices or interactive maps to help you avoid being tracked; your only true survival weapon will be your <strong>memory</strong> and your knowledge of the underground network.
        </p>

        <hr className="my-4 border-dark" />

        <h5 className="fw-bold mb-3 text-uppercase" style={{ color: 'var(--quinary, #8b0000)' }}>How to play</h5>
        <ul className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
          <li className="mb-2">At the start of the mission you will be assigned a <strong>Departure</strong> station and an <strong>Arrival</strong> station.</li>
          <li className="mb-2">You must reconstruct the entire route by selecting the correct intermediate stops in geographical order.</li>
          <li className="mb-2">Your route must start at the departure station and end at the arrival station. You have <strong>90 seconds</strong></li>
          <li className="mb-2">You will be shown bidirectional segments. Each of them represents a pair of stations that are adjacent on the same line. Segments can be selected once.</li>
          <li className="mb-2">Segments must be selected in order to form the correct path from the departure station to the arrival station.</li>
          <li className="mb-2">Pay close attention to <strong>interchange hubs</strong> if you need to jump from one line to another!</li>
          <li className="mb-2">Press Confirm only when you are absolutely sure of the route. If you make a mistake, you will be intercepted by the Government and the mission will fail.</li>
        </ul>

        <div className="p-3 mb-4 border border-dark" style={{ backgroundColor: 'rgba(0,0,0,0.05)', fontStyle: 'italic' }}>
          Remember: the survival of the Agency is in your hands. Be swift and invisible.
        </div>

        <div className="d-flex justify-content-end mt-2">
          <ButtonComponent text="CLOSE DOSSIER" colorVar="--secondary" onClick={handleClose} />
        </div>
      </PaperTemplate>
    </Modal>
  );
};

export default Instruction;
