import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { logIn } from '../api';
import ButtonComponent from './ButtonComponent';
import PaperTemplate from './PaperTemplate';
import LondonMapHome from '../assets/LondonMapHome.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userData = await logIn(username, password);
      setUser({ username: userData.username || username, loggedIn: true });
      navigate(`/user/${userData.username || username}`);
    } catch (err) {
      setError('Invalid credentials or server connection error.');
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>

      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
        backgroundImage: `url(${LondonMapHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}></div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <PaperTemplate
          className="p-4 shadow-lg d-flex flex-column"
          style={{
            width: '100%',
            maxWidth: '400px',
            transform: 'rotate(0.5deg)'
          }}
          headerStatus="[ ACCESS CONTROL ]"
        >
          <div className="text-center my-3">
            <h3 className="fw-bold m-0 text-uppercase" style={{ letterSpacing: '1px' }}>
              IDENTIFICATION REQUIRED
            </h3>
          </div>

          {error && (
            <div className="text-center mb-3">
              <div className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--quinary, #8b0000)' }}>ACCESS DENIED</div>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="fw-bold" style={{ fontSize: '0.9rem', opacity: 0.8 }}>AGENT CODENAME</label>
              <input
                type="text"
                className="form-control"
                style={{ backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid #1a1a1a', borderRadius: 0, fontFamily: 'inherit', color: 'inherit' }}
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="fw-bold" style={{ fontSize: '0.9rem', opacity: 0.8 }}>SECURITY CLEARANCE CODE</label>
              <input
                type="password"
                className="form-control"
                style={{ backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid #1a1a1a', borderRadius: 0, fontFamily: 'inherit', color: 'inherit' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mt-4 d-flex justify-content-center w-100">
              <ButtonComponent
                text="AUTHENTICATE"
                colorVar="--secondary"
                type="submit"
              />
            </div>
          </form>
        </PaperTemplate>
      </div>
    </div>
  );
};

export default Login;
