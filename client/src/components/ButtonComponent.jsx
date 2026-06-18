import React, { useState } from 'react';

const ButtonComponent = ({ text, colorVar = '--secondary', onClick, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const baseColor = `var(${colorVar})`;
  const textColor = 'var(--tertiary)'; 
  const darkBorder = 'var(--primary)'; 

  return (
    <div className={`d-flex flex-column align-items-center ${className}`}>
      {/* LED Indicator */}
      <div 
        style={{
          width: '18px',
          height: '6px',
          backgroundColor: isHovered ? '#ff3b3b' : '#3a0c0c',
          border: `2px solid ${darkBorder}`,
          marginBottom: '8px',
          boxShadow: isHovered ? '0 0 10px #ff3b3b, 0 0 5px #ff3b3b' : 'none',
          transition: 'none' // net change, no transition
        }}
      />
      
      {/* Industrial Button */}
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={onClick}
        style={{
          backgroundColor: baseColor,
          color: textColor,
          fontFamily: "'Special Elite', monospace",
          textTransform: 'uppercase',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          padding: '16px 40px',
          borderRadius: '0px',
          cursor: 'pointer',
          // Doppio bordo: bordo esterno spesso, ombra interna per spessore materiale
          border: `4px solid ${darkBorder}`,
          boxShadow: isPressed 
            ? `inset -3px -3px 0px rgba(0,0,0,0.5), inset 3px 3px 0px rgba(255,255,255,0.1)` 
            : `inset 3px 3px 0px rgba(255,255,255,0.2), inset -3px -3px 0px rgba(0,0,0,0.6)`,
          transform: isPressed ? 'translate(2px, 2px)' : 'none',
          transition: 'none', 
          letterSpacing: '2px',
          outline: 'none',
          minWidth: '150px' // Leggermente più largo che alto
        }}
      >
        {text}
      </button>
    </div>
  );
};

export default ButtonComponent;
