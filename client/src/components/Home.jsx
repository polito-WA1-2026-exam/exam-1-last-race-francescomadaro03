import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import Instruction from './Instruction';
import MetroScreen from './MetroScreen';
import ButtonComponent from './ButtonComponent';
import LondonMapHome from '../assets/LondonMapHome.png';

const Home = () => {
  const { user } = useContext(UserContext);
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = user !== null;

  return (
    <div
      className="container-fluid m-0 p-0 d-flex flex-column align-items-center justify-content-center"
      style={{
        height: 'calc(100vh - 80px)',
        minHeight: '600px',
        backgroundImage: `url(${LondonMapHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="mb-5 text-center">
        <MetroScreen text="London Underground Race" height="120px" />
      </div>

      <div className="mb-4">
        <ButtonComponent
          text="Mission Dossier"
          onClick={() => setShowInstructions(true)}
        />
      </div>

      {isLoggedIn ? (
        <div className="text-center mt-4">
          <h2 className="mb-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'var(--quaternary)', padding: '15px', borderRadius: '8px' }}>Welcome back, Agent {user.username}!</h2>
          <ButtonComponent
            text="Go to Profile"
            onClick={() => navigate(`/user/${user.username}`)}
          />
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="lead mb-4 fw-bold" style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '15px', borderRadius: '8px' }}>Sign in to test your memory on the London Underground.</p>
          <ButtonComponent
            text="Go to Login"
            onClick={() => navigate('/login')}
          />
        </div>
      )}

      <Instruction show={showInstructions} handleClose={() => setShowInstructions(false)} />
    </div>
  );
};

export default Home;
