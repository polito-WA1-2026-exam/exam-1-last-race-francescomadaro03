import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// 1. Creiamo e esportiamo il contesto per l'utente loggato
export const UserContext = createContext();

// --- PLACEHOLDER DEI COMPONENTI (Li sposteremo in file separati) ---

const Home = () => {
  return (
    <div>
      <h2>Home / Login</h2>
      <p>Qui metteremo le istruzioni del gioco e il form di login se l'utente non è autenticato.</p>
    </div>
  );
};

const Play = () => {
  return (
    <div>
      <h2>Game Zone</h2>
      <p>Qui ci sarà la logica a stati (LOADING, MEMORIZING, PLAYING, RESULTS).</p>
    </div>
  );
};

const Leaderboard = () => {
  return (
    <div>
      <h2>Classifica (Best Scores)</h2>
      <p>Qui la tabella con i punteggi migliori.</p>
    </div>
  );
};

const NotFound = () => {
  return (
    <div>
      <h2>404 - Pagina non trovata</h2>
      <Link to="/">Torna alla Home</Link>
    </div>
  );
};

// --- APP PRINCIPALE ---

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al mount dell'app, controlliamo se c'è una sessione attiva chiamando l'API
  useEffect(() => {
    // Qui andrà la chiamata fetch a GET /api/sessions/current
    // Per ora togliamo solo il loading
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Caricamento configurazione in corso...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        {/* Un Header basico condiviso in tutte le pagine */}
        <header style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '1rem' }}>
          <h1>London Underground Race</h1>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/">Home</Link>
            {user && <Link to="/play">Gioca</Link>}
            {user && <Link to="/leaderboard">Classifica</Link>}
            
            <div style={{ marginLeft: 'auto' }}>
              {user ? (
                <span>Benvenuto, {user.username}! <button onClick={() => setUser(null)}>Logout</button></span>
              ) : (
                <span>Ospite</span>
              )}
            </div>
          </nav>
        </header>

        {/* Il main accoglie le rotte */}
        <main style={{ padding: '0 1rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
