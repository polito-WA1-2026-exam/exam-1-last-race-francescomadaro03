import React from 'react';

/**
 * MetroScreen - A component that simulates a dot-matrix LED screen.
 * 
 * @param {string} text - The text to display
 * @param {string} width - The width of the screen (e.g., '100%', '300px')
 * @param {string} height - The height of the screen (e.g., '100px')
 * @param {string} fontSize - Optional explicit font size, otherwise calculated based on height
 */
const MetroScreen = ({ text, width = 'auto', height = '100px', fontSize }) => {
  return (
    <div 
      style={{
        width: width,
        height: height,
        backgroundColor: 'var(--primary)',
        color: 'var(--quinary)',
        fontFamily: "'Bitcount Prop Single', var(--sans)",
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '8px solid #111', 
        borderRadius: '8px',
        padding: '10px 20px',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9), 0 5px 15px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Overlay to simulate the LED grid matrix feel */}
      <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle, rgba(0,0,0,0.4) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
          pointerEvents: 'none',
          zIndex: 0
      }} />
      <span
        style={{
          fontSize: fontSize || `calc(${typeof height === 'string' && height.includes('px') ? height : '100px'} * 0.5)`,
          textShadow: '0 0 5px var(--quinary), 0 0 12px var(--quinary)', 
          letterSpacing: '0.08em',
          lineHeight: '1.2',
          zIndex: 1,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'pre-wrap',
          textAlign: 'left'
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default MetroScreen;
