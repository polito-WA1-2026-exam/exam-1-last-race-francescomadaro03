import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { logOut } from '../api';

const NavText = ({ onClick, to, children }) => {
  const [hover, setHover] = useState(false);

  const style = {
    textDecoration: 'none',
    color: hover ? 'var(--quinary)' : 'var(--quaternary)',
    transition: 'color 0.2s',
    cursor: 'pointer',
    fontVariantNumeric: 'tabular-nums',
    textShadow: hover ? '0 0 5px var(--quinary), 0 0 12px var(--quinary)' : '0 0 5px var(--quaternary), 0 0 12px var(--quaternary)',
    letterSpacing: '0.08em',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'inherit',
    fontSize: 'inherit'
  };

  if (to) {
    return (
      <Link
        to={to}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={style}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Logout err', err);
    }
    navigate('/');
    setTimeout(() => setUser(null), 10); //timeout to avoid navigation problem

  };

  return (
    <header
      style={{
        height: '80px',
        backgroundColor: 'var(--primary)',
        color: 'var(--quinary)',
        fontFamily: "'Bitcount Prop Single', var(--sans)",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '8px solid #111',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        padding: '0 2rem',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9), 0 5px 15px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontSize: '1.2rem',
        margin: 0
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        <NavText to="/">LONDON UNDERGROUND RACE</NavText>
      </div>

      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {user && <NavText to={`/user/${user.username}`}>PROFILE</NavText>}
        {user && <NavText to="/play">PLAY</NavText>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: '2rem' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--quaternary)', letterSpacing: '0.08em', textShadow: '0 0 5px var(--quaternary), 0 0 12px var(--quaternary)' }}>
                AGENT {user.username.toUpperCase()}
              </span>
              <NavText onClick={handleLogout}>LOGOUT</NavText>
            </>
          ) : (
            <span style={{ color: 'var(--quaternary)', letterSpacing: '0.08em', textShadow: '0 0 5px var(--quaternary), 0 0 12px var(--quaternary)' }}>
              GUEST
            </span>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
