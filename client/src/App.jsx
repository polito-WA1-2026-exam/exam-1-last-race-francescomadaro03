import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Header from './components/Header';
import Home from './components/Home';
import Play from './components/Play';
import Travel from './components/Travel';
import Result from './components/Result';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentSession } from './api';
import './App.css';

// 1. Creiamo e esportiamo il contesto per l'utente loggato
export const UserContext = createContext();

// --- COMPONENTI INTERNI ---
// Rimosse le definizioni inline (Header, Home, Play, NotFound) ora in file separati.

// --- APP PRINCIPALE ---

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al mount dell'app, controlliamo se c'è una sessione attiva chiamando l'API
  useEffect(() => {
    getCurrentSession()
      .then(user => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/:username" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/play" element={
            <ProtectedRoute>
              <Play />
            </ProtectedRoute>
          } />
          <Route path="/travel" element={
            <ProtectedRoute>
              <Travel />
            </ProtectedRoute>
          } />
          <Route path="/result" element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
