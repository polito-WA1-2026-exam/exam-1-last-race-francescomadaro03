import React from 'react';
import PaperTemplate from './PaperTemplate';

const InterceptedMission = ({ mission }) => {
  if (!mission) return null;

  return (
    <PaperTemplate 
      className="mb-3 p-3 shadow-sm text-center"
      headerTitle="THE AGENCY"
      headerStatus="[ MISSION BRIEFING ]"
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
    </PaperTemplate>
  );
};

export default InterceptedMission;
