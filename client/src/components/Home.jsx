import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import Instruction from './Instruction';

const Home = () => {
  const { user } = useContext(UserContext);
  const [showInstructions, setShowInstructions] = useState(false);
  
  return (
    <div className="container-fluid m-0 p-0 d-flex flex-column align-items-center justify-content-center" style={{ height: 'calc(100vh - 80px)', minHeight: '600px' }}>
      <h1 className="mb-4 text-center">London Underground Race</h1>
      
      <div className="mb-4">
        <button className="btn btn-outline-info rounded-pill px-4 shadow-sm" onClick={() => setShowInstructions(true)}>
          <i className="bi bi-book me-2"></i> Dossier della Missione
        </button>
      </div>

      {user && user.loggedIn ? (
        <div className="text-center">
          <h2>Bentornato, {user.username}!</h2>
          <Link to={`/user/${user.username}`} className="btn btn-success mt-3 btn-lg">Vai al tuo Profilo</Link>
        </div>
      ) : (
        <div className="text-center">
          <p className="lead mb-4">Accedi per testare la tua memoria sulla metropolitana di Londra.</p>
          <Link to="/login" className="btn btn-primary btn-lg">Vai al Login</Link>
        </div>
      )}

      <Instruction show={showInstructions} handleClose={() => setShowInstructions(false)} />
    </div>
  );
};

export default Home;
