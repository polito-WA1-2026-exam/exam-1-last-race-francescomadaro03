import React from 'react';

const InterceptedMission = ({ mission }) => {
  if (!mission) return null;

  return (
    <div 
      className="mb-3 p-3 shadow-sm text-center"
      style={{
        backgroundColor: 'var(--tertiary)', // Colore carta
        color: 'var(--primary)', // Inchiostro
        border: '2px dashed var(--primary)', // Bordo tratteggiato a mo' di biglietto
        fontFamily: "'Special Elite', monospace",
        position: 'relative'
      }}
    >
      <div className="fw-bold text-uppercase" style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>
        {mission.start.name}
      </div>
      <div className="my-1 fw-bold" style={{ fontSize: '1.2rem', color: 'var(--quinary)' }}>
        ↓
      </div>
      <div className="fw-bold text-uppercase" style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>
        {mission.end.name}
      </div>
    </div>
  );
};

export default InterceptedMission;
