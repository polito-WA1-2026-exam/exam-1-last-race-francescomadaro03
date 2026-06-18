import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../api';
import MetroScreen from './MetroScreen';
import ButtonComponent from './ButtonComponent';
import LondonMapHome from '../assets/LondonMapHome.png';
import InterceptedMessage from './InterceptedMessage';

const text = "The Agency needs you. Newly intercepted messages must be taken to the headquarters scattered across London. Do not get caught by the enemy agents, and remember: Mind the Gap!"


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

  const getLeaderboardText = () => {
    if (loading) return "CARICAMENTO...";
    if (error) return "ERRORE CONNESSIONE";
    if (leaderboard.length === 0) return "NESSUN PUNTEGGIO";

    const title = "Best Undercover Agents\n";
    const entries = leaderboard.map((entry, index) => {
      const pos = `${index + 1}.`.padEnd(3);
      const name = `${entry.username}${entry.username === username ? ' *' : ''}`.padEnd(12).substring(0, 12);
      const score = String(entry.score).padStart(4);
      return `${pos} ${name} ${score}`;
    });
    return title + entries.join('\n');
  };

  return (
    <div
      className="container-fluid m-0 p-0 d-flex flex-column align-items-center justify-content-center"
      style={{
        minHeight: 'calc(100vh - 80px)',
        backgroundImage: `url(${LondonMapHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '2rem'
      }}
    >
      <h2 className="mb-4 text-center p-3" style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: '8px' }}>
        Benvenuto, <span className="text-var--quinary">{username}</span>!
      </h2>

      <div className="row w-100 mt-4" style={{ maxWidth: '1200px' }}>
        {/* Sinistra: Gioca Ancora */}
        <div className="col-md-6 mb-4 d-flex flex-column align-items-center justify-content-center">
          <InterceptedMessage text={text}></InterceptedMessage>
          <ButtonComponent text="Take off" onClick={() => navigate('/play')}></ButtonComponent>
        </div>

        {/* Destra: Classifica (Dossier) */}
        <div className="col-md-6 mb-4 d-flex justify-content-center align-items-center">
          <MetroScreen
            text={getLeaderboardText()}
            width="100%"
            height="100%"
            fontSize="24px"
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
