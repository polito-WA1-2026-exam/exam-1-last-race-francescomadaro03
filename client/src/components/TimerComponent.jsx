import React from 'react';

const TimerComponent = ({ timeLeft, maxTime = 90 }) => {
  const percentage = Math.max(0, (timeLeft / maxTime) * 100);

  return (
    <div className="w-100 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-bold fs-5" style={{ color: 'var(--text-h)' }}>
          ⏱ Tempo rimanente:
        </span>
        <span 
          className={`fw-bold fs-5 ${timeLeft <= 10 ? 'text-danger' : ''}`} 
          style={{ color: timeLeft > 10 ? 'var(--secondary)' : undefined }}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="progress" style={{ height: '12px', backgroundColor: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
        <div 
          className={`progress-bar ${timeLeft <= 10 ? 'bg-danger' : ''}`} 
          role="progressbar" 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: timeLeft > 10 ? 'var(--secondary)' : undefined,
            transition: 'width 1s linear'
          }} 
          aria-valuenow={percentage} 
          aria-valuemin="0" 
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default TimerComponent;
