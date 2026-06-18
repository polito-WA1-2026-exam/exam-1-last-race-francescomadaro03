import React from 'react';

const InterceptedMessage = ({ text }) => {
  return (
    <div
      className="mb-4 p-3 shadow-sm"
      style={{
        backgroundColor: '#e6ded3', // Colore carta vecchia
        color: '#1a1a1a', // Inchiostro da macchina da scrivere
        fontFamily: "'Special Elite', monospace",
        border: '2px dashed #5a5a5a',
        position: 'relative',
        overflow: 'hidden',
        transform: 'rotate(1deg)'
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="d-flex justify-content-between border-bottom border-dark pb-1 mb-3">
          <small className="fw-bold" style={{ opacity: 0.8 }}>THE AGENCY</small>
          <small className="fw-bold" style={{ color: 'var(--quinary)' }}>[ STATUS: CONFIDENTIAL ]</small>
        </div>

        <div className="p-2" style={{ fontSize: '1.2rem', lineHeight: '1.6', letterSpacing: '1px' }}>
          {text}
        </div>
      </div>

      {/* Timbro Intercettato in trasparenza */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        color: 'rgba(166, 79, 60, 0.4)', // var(--quinary) traslucido
        border: '3px double rgba(166, 79, 60, 0.4)',
        borderRadius: '50%',
        width: '75px',
        height: '75px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotate(-25deg)',
        fontSize: '0.65rem',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 1,
        pointerEvents: 'none',
        zIndex: 2
      }}>
        Interception
      </div>
    </div>
  );
};

export default InterceptedMessage;
