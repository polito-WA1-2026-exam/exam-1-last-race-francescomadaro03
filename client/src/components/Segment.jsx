import React from 'react';

const Segment = ({ segment, isSelected, onClick }) => {
  return (
    <div 
      className={`card mb-2 shadow-sm ${isSelected ? 'border-primary border-2 bg-light' : 'border-0'}`}
      onClick={() => onClick && onClick(segment)}
      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
    >
      <div className="card-body p-3 d-flex align-items-center">
        {/* Line Color Indicator */}
        <div 
          style={{ 
            width: '12px', 
            height: '40px', 
            backgroundColor: segment.color, 
            borderRadius: '6px',
            marginRight: '15px'
          }}
        ></div>
        
        {/* Stations */}
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">{segment.from}</span>
            <i className="bi bi-arrow-right text-muted mx-2">➔</i>
            <span className="fw-bold">{segment.to}</span>
          </div>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>Linea: {segment.lineName}</small>
        </div>
      </div>
    </div>
  );
};

export default Segment;
