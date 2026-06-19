import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InterceptedMessage from './InterceptedMessage';
import ButtonComponent from './ButtonComponent';
import LondonMapHome from '../assets/LondonMapHome.png';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  
  const isValid = state.isValid;
  const events = state.events || [];
  const error = state.error;
  const finalScore = state.finalScore || 0;

  let messageContent;

  if (isValid) {
    messageContent = (
      <div>
        <h4 className="mb-3 text-uppercase fw-bold" style={{ color: 'var(--quaternary)' }}>MISSION ACCOMPLISHED</h4>
        <div className="mb-3">
          <strong>Final Balance:</strong> {finalScore} COIN
        </div>
        <div className="flex-grow-1 my-2 hide-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <strong>Travel Log:</strong>
          <ul className="list-unstyled mt-2">
            {events.map((ev, i) => (
              <li key={i} className="py-2 border-bottom border-dark border-opacity-25 d-flex justify-content-between align-items-center">
                <div>{ev.event_name || ev.message}</div>
                <div className="fw-bold fs-5 ms-2 text-nowrap" style={{ color: ev.bonus >= 0 ? '#1a1a1a' : 'var(--quinary)' }}>
                  {ev.bonus > 0 ? '+' : ''}{ev.bonus}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else {
    messageContent = (
      <div className="text-center">
        <h4 className="mb-3 text-uppercase fw-bold" style={{ color: 'var(--quinary)' }}>FATAL ERROR</h4>
        <p className="fs-5">{error || "Mission failed."}</p>
        <div className="mt-4">
          <strong>Final Balance:</strong> {finalScore} COIN
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid m-0 p-0 d-flex flex-column align-items-center justify-content-center"
      style={{
        height: 'calc(100vh - 80px)',
        minHeight: '600px',
        backgroundImage: `url(${LondonMapHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div style={{ width: '100%', maxWidth: '600px', padding: '20px' }}>
        <InterceptedMessage text={messageContent} />
        <div className="text-center mt-4">
          <ButtonComponent
            text="CLOSE DOSSIER"
            onClick={() => navigate('/home')}
          />
        </div>
      </div>
    </div>
  );
};

export default Result;
