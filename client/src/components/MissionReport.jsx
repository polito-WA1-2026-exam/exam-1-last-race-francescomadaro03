import React from 'react';
import ButtonComponent from './ButtonComponent';

const MissionReport = ({ result, onRestart }) => {
  if (!result) return null;

  const isSuccess = result.isValid;

  return (
    <div 
      className="p-4 shadow-sm d-flex flex-column"
      style={{
        flexGrow: 1,
        minHeight: 0,
        backgroundColor: '#e6ded3', // Colore carta vecchia
        color: '#1a1a1a', // Inchiostro da macchina da scrivere
        fontFamily: "'Special Elite', monospace",
        border: '2px dashed #5a5a5a',
        position: 'relative',
        overflow: 'hidden',
        transform: 'rotate(0.5deg)'
      }}
    >
      {/* Effetto texture carta */}
      <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.08%22/%3E%3C/svg%3E")',
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
          zIndex: 0
      }} />

      <div className="d-flex flex-column" style={{ position: 'relative', zIndex: 1, flexGrow: 1, minHeight: 0 }}>
        <div className="d-flex justify-content-between border-bottom border-dark pb-1 mb-3">
          <small className="fw-bold" style={{ opacity: 0.8 }}>THE AGENCY</small>
          <small className="fw-bold" style={{ color: 'var(--quinary)' }}>[ AFTER ACTION REPORT ]</small>
        </div>

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
      </div>
      
      {/* Timbro */}
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
    </div>
  );
};

export default MissionReport;
