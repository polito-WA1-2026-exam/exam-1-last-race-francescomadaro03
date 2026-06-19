import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEvents } from '../api';
import InterceptedMessage from './InterceptedMessage';
import travelVideo from '../assets/travel.webm';

const Travel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [finalScore, setFinalScore] = useState(20);
  const videoRef = useRef(null);

  // Otteniamo il numero di stazioni (segmenti) dalla validazione
  const numStations = location.state?.numStations || 1;

  useEffect(() => {
    // 1. Carica gli eventi dal server
    getEvents(numStations)
      .then(data => {
        setEvents(data);

        // Calcola il punteggio finale in anticipo simulando il percorso
        let score = 20;
        data.forEach(ev => {
          score += ev.bonus;
          if (score < 0) score = 0;
        });
        setFinalScore(score);

        setLoading(false);
        // Fa partire l'iterazione dal primo evento
        setCurrentEventIndex(0);
      })
      .catch(err => {
        console.error(err);
        navigate('/result', { state: { isValid: false, error: "Error retrieving events", finalScore: 0 } });
      });
  }, [numStations, navigate]);

  useEffect(() => {
    if (loading || currentEventIndex === -1) return;

    if (currentEventIndex >= events.length) {
      // 3. Finiti gli eventi, naviga a /result passando lo storico
      navigate('/result', {
        state: {
          isValid: true,
          events: events,
          finalScore: finalScore
        }
      });
      return;
    }

    // 2. Imposta un timer di 8 secondi per iterare sull'evento successivo
    const timer = setTimeout(() => {
      setCurrentEventIndex(prev => prev + 1);
      // Forza il video a ripartire da zero se non è già gestito dall'evento
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentEventIndex, loading, events, navigate, finalScore]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-dark text-white" style={{ height: 'calc(100vh - 80px)' }}>
        <h3 style={{ fontFamily: "'Special Elite', monospace" }}>Encrypted transmission in progress...</h3>
      </div>
    );
  }

  const currentEvent = events[currentEventIndex];

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 80px)', overflow: 'hidden', backgroundColor: 'black' }}>
      <video 
        ref={videoRef}
        src={travelVideo} 
        autoPlay 
        muted 
        onTimeUpdate={(e) => {
          if (e.target.currentTime >= 8) {
            e.target.currentTime = 0;
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      />

      {currentEvent && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          width: '90%',
          maxWidth: '500px'
        }}>
          <InterceptedMessage
            text={
              <div className="text-center p-3">
                <h5 style={{ lineHeight: '1.4' }}>{currentEvent.event_name || currentEvent.message}</h5>
                <p className="fs-3 mt-4 fw-bold mb-0" style={{ color: currentEvent.bonus >= 0 ? '#1a1a1a' : 'var(--quinary)' }}>
                  {currentEvent.bonus > 0 ? '+' : ''}{currentEvent.bonus} COIN
                </p>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default Travel;
