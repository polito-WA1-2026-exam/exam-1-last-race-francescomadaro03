import React from 'react';
import PropagandaPanel from './PropagandaPanel';

const Segment = ({ segment, isSelected, onClick }) => {
  return (
    <PropagandaPanel 
      isSelected={isSelected} 
      onClick={() => onClick && onClick(segment)}
    >
      <div className="d-flex align-items-center justify-content-center w-100">
        {/* Stations Only */}
        <div className="w-100">
          <div className="d-flex justify-content-between align-items-center">
            <span style={{ color: 'var(--primary)' }}>{segment.from}</span>
            
            {/* Flat Triangle Arrow */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--quinary)" style={{ margin: '0 10px' }}>
              <polygon points="4,4 20,12 4,20" />
            </svg>
            
            <span style={{ color: 'var(--primary)' }}>{segment.to}</span>
          </div>
        </div>
      </div>
    </PropagandaPanel>
  );
};

export default Segment;
