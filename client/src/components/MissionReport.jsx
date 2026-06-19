import React from 'react';
import ButtonComponent from './ButtonComponent';
import PaperTemplate from './PaperTemplate';

const MissionReport = ({ result, onRestart }) => {
  if (!result) return null;

  const isSuccess = result.isValid;

  return (
    <PaperTemplate 
      className="p-4 shadow-sm d-flex flex-column"
      style={{
        flexGrow: 1,
        minHeight: 0,
        transform: 'rotate(0.5deg)'
      }}
      contentStyle={{ flexGrow: 1, minHeight: 0 }}
      headerStatus="[ AFTER ACTION REPORT ]"
      headerStatusColor="var(--quinary)"
      extraOverlay={
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '5%',
          color: isSuccess ? 'rgba(45, 74, 30, 0.4)' : 'rgba(166, 79, 60, 0.4)',
          border: `5px double ${isSuccess ? 'rgba(45, 74, 30, 0.4)' : 'rgba(166, 79, 60, 0.4)'}`,
          borderRadius: '8px',
          padding: '10px 15px',
          transform: 'rotate(-15deg)',
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 1,
          pointerEvents: 'none',
          zIndex: 2,
          letterSpacing: '4px'
        }}>
          {isSuccess ? 'SURVIVED' : 'ARRESTED'}
        </div>
      }
    >
      <div className="text-center my-2">
        <h3 className="fw-bold m-0 text-uppercase" style={{ letterSpacing: '1px' }}>
          {isSuccess ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
        </h3>
      </div>

      <div className="text-center my-3">
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>FINAL BALANCE</div>
        <div className="fw-bold" style={{ fontSize: '3.5rem', lineHeight: '1' }}>
          {isSuccess ? result.finalScore : 0} <span style={{ fontSize: '1.2rem' }}>COIN</span>
        </div>
      </div>

      {isSuccess ? (
        <div className="d-flex flex-column flex-grow-1" style={{ minHeight: 0 }}>
          <div className="fw-bold mt-2 border-bottom border-dark pb-1">TRAVEL LOG:</div>
          <div className="flex-grow-1 my-2 hide-scroll" style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', minHeight: 0 }}>
            <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
            <ul className="list-unstyled m-0">
              {result.events.map((ev, i) => (
                <li key={i} className="py-2 border-bottom border-dark border-opacity-25 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold" style={{ fontSize: '0.8rem', opacity: 0.8 }}>{ev.segment}</div>
                    <div style={{ fontSize: '0.95rem' }}>{ev.message}</div>
                  </div>
                  <div className="fw-bold fs-4 ms-2 text-nowrap" style={{ color: ev.scoreChange >= 0 ? '#1a1a1a' : 'var(--quinary)' }}>
                    {ev.scoreChange > 0 ? '+' : ''}{ev.scoreChange}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex-grow-1 d-flex flex-column justify-content-center text-center px-3" style={{ minHeight: 0 }}>
           <div className="fw-bold mb-2" style={{ fontSize: '1.2rem', color: 'var(--quinary)' }}>FATAL ERROR</div>
           <p>{result.error}</p>
        </div>
      )}

      <div className="mt-3 d-flex justify-content-center w-100">
         <ButtonComponent 
           text="CHIUDI DOSSIER" 
           colorVar="--secondary" 
           onClick={onRestart} 
         />
      </div>
    </PaperTemplate>
  );
};

export default MissionReport;
