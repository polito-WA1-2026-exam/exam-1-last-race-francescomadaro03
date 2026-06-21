import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DystopicMap from './DystopicMap';
import SegmentHandler from './SegmentHandler';
import TimerComponent from './TimerComponent';
import ButtonComponent from './ButtonComponent';
import InterceptedMessage from './InterceptedMessage';
import { getNetwork, setupGame, validateGame } from '../api';

const Play = () => {
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [networkData, setNetworkData] = useState([]);
  const [mission, setMission] = useState(null);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [startTime, setStartTime] = useState(null);

  // Caricamento iniziale dei dati della mappa
  useEffect(() => {
    let isCancelled = false;
    getNetwork()
      .then(data => {
        // Guardia per evitare di settare lo stato se il componente viene smontato prima che la fetch finisca
        if (!isCancelled) setNetworkData(data);
      })
      .catch(console.error);

    return () => { isCancelled = true; };
  }, []);

  // Gestione del Timer: creiamo un singolo intervallo all'inizio della partita
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer); // Ferma il timer quando arriva a zero
            return 0;
          }
          return prev - 1; // Riduci il tempo di 1 secondo
        });
      }, 1000);
    }
    // Cleanup function: distrugge il timer a fine partita o se il componente si smonta
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Auto-submit quando il tempo scade
  // Nota: gestiamo l'invio qui fuori dal setState del timer per evitare di eseguire side-effects (API) 
  // dentro un setState e per non inviare dati obsoleti (stale closures di selectedSegments)
  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      submitMission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isPlaying]);

  const submitMission = async () => {
    try {
      const payload = selectedSegments.map(s => ({
        lineId: s.lineId,
        startId: s.fromId,
        endId: s.toId
      }));

      const endTime = Date.now();
      const res = await validateGame(payload, startTime, endTime);

      setIsPlaying(false);
      navigate('/travel', { state: { numStations: res.numStations } });
    } catch (err) {
      setIsPlaying(false);
      navigate('/result', { state: { isValid: false, error: err.message, finalScore: 0 } });
    }
  };

  const startMission = async () => {
    try {
      const newMission = await setupGame();
      setMission(newMission);
      setSelectedSegments([]); // Azzera i segmenti scelti
      setTimeLeft(90);         // Riporta il timer a 90 secondi
      setStartTime(Date.now());// Segna quando è iniziata la partita
      setIsPlaying(true);
    } catch (e) {
      alert('Error loading mission');
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
        <DystopicMap fetchStations={getNetwork} showLines={!isPlaying} />
      </div>

      {/* Destra: Pannello di Gioco (30%) */}
      <div style={{ width: '30%', height: '100%', backgroundColor: '#f8f9fa', borderLeft: '2px solid #dee2e6', display: 'flex', flexDirection: 'column' }}>
        <div className="p-4 d-flex flex-column h-100">
          {isPlaying && <TimerComponent timeLeft={timeLeft} maxTime={90} />}

          <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
            {isPlaying ? (
              <>
                <div className="flex-grow-1" style={{ minHeight: 0, overflow: 'hidden' }}>
                  <SegmentHandler
                    rawData={networkData}
                    mission={mission}
                    selectedSegments={selectedSegments}
                    onSegmentClick={handleSegmentClick}
                  />
                </div>
                <div className="mt-3 mb-2 d-flex justify-content-center w-100">
                  <ButtonComponent
                    text="TRANSMIT"
                    colorVar="--secondary"
                    onClick={submitMission}
                  />
                </div>
              </>
            ) : (
              <InterceptedMessage text="You have been intercepted. Have a close look at the map, nobody in the Tube will help you nor could be trusted." />
            )}
          </div>

          {!isPlaying && (
            <div className="mt-3 mb-2 d-flex justify-content-center w-100">
              <ButtonComponent
                text="EXECUTE"
                colorVar="--quinary"
                onClick={startMission}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Play;
