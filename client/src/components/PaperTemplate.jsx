import React from 'react';

const PaperTemplate = ({
  children,
  className = '',
  style = {},
  contentStyle = {},
  headerTitle = 'THE AGENCY',
  headerStatus = '',
  headerStatusColor = 'var(--quinary, #8b0000)'
}) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: '#e6ded3', // Colore carta vecchia
        color: '#1a1a1a', // Inchiostro da macchina da scrivere
        fontFamily: "'Special Elite', monospace",
        border: '2px dashed #5a5a5a',
        position: 'relative',
        overflow: 'hidden',
        ...style
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

      <div className="d-flex flex-column" style={{ position: 'relative', zIndex: 1, ...contentStyle }}>
        {(headerTitle || headerStatus) && (
          <div className="d-flex justify-content-between border-bottom border-dark pb-1 mb-3">
            {headerTitle && <small className="fw-bold" style={{ opacity: 0.8 }}>{headerTitle}</small>}
            {headerStatus && <small className="fw-bold" style={{ color: headerStatusColor }}>{headerStatus}</small>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default PaperTemplate;
