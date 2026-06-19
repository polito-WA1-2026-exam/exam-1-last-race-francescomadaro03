import React from 'react';
import PaperTemplate from './PaperTemplate';

const InterceptedMessage = ({ text }) => {
  return (
    <PaperTemplate
      className="mb-4 p-3 shadow-sm"
      style={{ transform: 'rotate(1deg)' }}
      headerStatus="[ STATUS: CONFIDENTIAL ]"
      headerStatusColor="var(--quinary)"
    >
      <div className="p-2" style={{ fontSize: '1.2rem', lineHeight: '1.6', letterSpacing: '1px' }}>
        {text}
      </div>
    </PaperTemplate>
  );
};

export default InterceptedMessage;
