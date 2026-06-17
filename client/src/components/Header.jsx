import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aggiungere qui la chiamata API eventuale per invalidare la sessione
    setUser(null);
    navigate('/');
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#f0f0f0', margin: 0, height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>London Underground Race</h1>
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/">Home</Link>
        {user && <Link to={`/user/${user.username}`}>Profilo</Link>}
        {user && <Link to="/play">Gioca</Link>}
        
        <div>
          {user ? (
            <span>Benvenuto, {user.username}! <button className="btn btn-sm btn-outline-danger ms-2" onClick={handleLogout}>Logout</button></span>
          ) : (
            <span>Ospite</span>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
