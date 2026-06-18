import React from 'react';

/**
 * PropagandaPanel - A dynamic container styled like a 1950s Soviet propaganda poster.
 */
const PropagandaPanel = ({ children, isSelected, onClick, className = '', style = {} }) => {
  return (
    <div 
      onClick={onClick}
      className={`propaganda-panel ${className}`}
      style={{
        backgroundColor: 'var(--tertiary)',
        color: 'var(--primary)',
        border: '6px solid var(--primary)',
        borderRadius: '0px',
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: isSelected ? '12px 12px 0px var(--quinary)' : '6px 6px 0px var(--primary)',
        transform: isSelected ? 'translate(-6px, -6px)' : 'none',
        transition: 'all 0.15s ease-out',
        position: 'relative',
        textTransform: 'uppercase',
        overflow: 'hidden',
        marginBottom: '1rem',
        ...style
      }}
    >
      {/* Texture serigrafica / metallo ossidato */}
      <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E")',
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
          zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1, fontFamily: "'Monoton', var(--heading)", fontWeight: 'normal', fontSize: '1.2rem', letterSpacing: '2px' }}>
        {children}
      </div>
    </div>
  );
};

export default PropagandaPanel;
