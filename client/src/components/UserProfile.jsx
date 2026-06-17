import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../api';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLeaderboard()
      .then(data => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Impossibile caricare la classifica.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Benvenuto, <span className="text-primary">{username}</span>!</h2>
      
      <div className="row mt-5">
        {/* Sinistra: Classifica */}
        <div className="col-md-7 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">🏆 Best Scores (Leaderboard)</h4>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="p-4 text-center">Caricamento classifica...</div>
              ) : error ? (
                <div className="p-4 text-danger">{error}</div>
              ) : (
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Posizione</th>
                      <th>Giocatore</th>
                      <th className="text-end">Punteggio Massimo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.username} className={entry.username === username ? 'table-warning fw-bold' : ''}>
                        <td>#{index + 1}</td>
                        <td>{entry.username} {entry.username === username && '(Tu)'}</td>
                        <td className="text-end">{entry.score}</td>
                      </tr>
                    ))}
                    {leaderboard.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center">Nessun punteggio registrato.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Destra: Gioca Ancora */}
        <div className="col-md-5 d-flex flex-column align-items-center justify-content-center">
          <div className="card shadow p-4 text-center border-0 bg-light w-100" style={{ borderRadius: '15px' }}>
            <h3 className="mb-4">Pronto per un'altra corsa?</h3>
            <p className="text-muted mb-4">
              Memorizza la mappa e raggiungi il maggior numero di stazioni prima dello scadere del tempo!
            </p>
            <button 
              className="btn btn-success btn-lg px-5 py-3 fw-bold shadow-sm" 
              onClick={() => navigate('/play')}
              style={{ fontSize: '1.5rem', borderRadius: '50px', transition: 'all 0.2s' }}
            >
              🚀 PLAY AGAIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
