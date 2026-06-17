import TransitMap from './TransitMap';
import SegmentHandler from './SegmentHandler';
import { getNetwork, setupGame, validateGame } from '../api';
import { useState, useEffect } from 'react';

const Play = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMapLines, setShowMapLines] = useState(true);
  const [rawData, setRawData] = useState([]);
  const [mission, setMission] = useState(null);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [startTime, setStartTime] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // Ripristinato: scarica i dati crudi in autonomia per non dipendere da TransitMap
  useEffect(() => {
    getNetwork().then(setRawData).catch(console.error);
  }, []);

  // Gestisce il re-rendering della mappa (spegne le linee) quando il gioco inizia
  useEffect(() => {
    if (isPlaying) {
      setShowMapLines(false);
    } else {
      setShowMapLines(true);
    }
  }, [isPlaying]);

  // Gestione del Timer
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      handleSubmission(); // Se il tempo scade, invia comunque quello che hai fatto
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleSubmission = async () => {
    try {
      const payload = selectedSegments.map(s => ({
        startId: s.fromId,
        endId: s.toId
      }));

      const endTime = Date.now();
      const res = await validateGame(payload, startTime, endTime);
      setGameResult(res);
      setIsPlaying(false);
    } catch (err) {
      setGameResult({
        isValid: false,
        error: err.message,
        finalScore: 0
      });
      setIsPlaying(false);
    }
  };

  const handleSegmentClick = (segment) => {
    setSelectedSegments(prev => {
      // Se il segmento è già selezionato, lo rimuoviamo (toggle)
      const exists = prev.find(s => s.id === segment.id);
      if (exists) {
        return prev.filter(s => s.id !== segment.id);
      }
      // Altrimenti lo aggiungiamo in coda
      return [...prev, segment];
    });
  };

  return (
    <div className="container-fluid m-0 p-0 d-flex" style={{ height: 'calc(100vh - 80px)', minHeight: '600px' }}>
      {/* Sinistra: Mappa (70%) */}
      <div style={{ width: '70%', height: '100%', position: 'relative' }}>
        <TransitMap fetchStations={getNetwork} showLines={showMapLines} />
      </div>

      {/* Destra: Pannello di Gioco (30%) */}
      <div style={{ width: '30%', height: '100%', backgroundColor: '#f8f9fa', borderLeft: '2px solid #dee2e6', display: 'flex', flexDirection: 'column' }}>

        {/* Schermata dei Risultati */}
        {gameResult ? (
          <div className="p-4 d-flex flex-column h-100 justify-content-center text-center">
            {gameResult.isValid ? (
              <div className="alert alert-success">
                <h2 className="mb-3">🎉 Vittoria!</h2>
                <p>Hai raggiunto la destinazione correttamente!</p>
                <div className="display-4 fw-bold mb-4">{gameResult.finalScore} <i className="bi bi-coin text-warning"></i></div>
                <h5 className="mb-3 text-start">Eventi del Viaggio:</h5>
                <ul className="list-group text-start mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {gameResult.events.map((ev, i) => (
                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                      <small>{ev.segment}: {ev.message}</small>
                      <span className={`badge ${ev.scoreChange >= 0 ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                        {ev.scoreChange > 0 ? '+' : ''}{ev.scoreChange}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="alert alert-danger">
                <h2 className="mb-3">💥 Disastro!</h2>
                <p>{gameResult.error}</p>
                <div className="display-4 fw-bold mb-4">0 <i className="bi bi-coin text-warning"></i></div>
              </div>
            )}
            <button
              className="btn btn-primary btn-lg mt-3"
              onClick={() => {
                setGameResult(null);
                setMission(null);
                setSelectedSegments([]);
                setTimeLeft(90);
              }}
            >
              Ritorna alla Mappa
            </button>
          </div>
        ) : (
          <div className="p-4 d-flex flex-column h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="m-0">Pannello di Gioco</h3>
              {isPlaying && (
                <div className={`fs-4 fw-bold ${timeLeft <= 10 ? 'text-danger' : 'text-primary'}`}>
                  ⏱ {timeLeft}s
                </div>
              )}
            </div>

            <div className="flex-grow-1" style={{ minHeight: 0 }}>
              {isPlaying ? (
                <>
                  <SegmentHandler
                    rawData={rawData}
                    mission={mission}
                    selectedSegments={selectedSegments}
                    onSegmentClick={handleSegmentClick}
                  />
                  <button
                    className="btn btn-primary btn-lg w-100 py-3 mt-3 shadow"
                    onClick={handleSubmission}
                    style={{ borderRadius: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}
                  >
                    Parti! 🚂
                  </button>
                </>
              ) : (
                <div className="alert alert-warning text-center shadow-sm">
                  <h5 className="mb-2">Fase di Memorizzazione</h5>
                  <p className="mb-0 text-muted">Studia bene i percorsi colorati prima di cliccare su Start.</p>
                </div>
              )}
            </div>

            {!isPlaying && (
              <button
                className="btn btn-success btn-lg w-100 py-3 mt-3 shadow"
                onClick={async () => {
                  try {
                    const m = await setupGame();
                    setMission(m);
                    setSelectedSegments([]); // Reset dei segmenti
                    setTimeLeft(90); // Reset timer a 90 secondi
                    setStartTime(Date.now()); // Registra il timestamp di partenza
                    setIsPlaying(true);
                  } catch (e) {
                    alert('Errore caricamento missione');
                  }
                }}
                style={{ borderRadius: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                🚀 INIZIA A GIOCARE
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;
