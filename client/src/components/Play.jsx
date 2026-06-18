import DystopicMap from './DystopicMap';
import SegmentHandler from './SegmentHandler';
import TimerComponent from './TimerComponent';
import ButtonComponent from './ButtonComponent';
import InterceptedMessage from './InterceptedMessage';
import MissionReport from './MissionReport';
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
        <DystopicMap fetchStations={getNetwork} showLines={showMapLines} />
      </div>

      {/* Destra: Pannello di Gioco (30%) */}
      <div style={{ width: '30%', height: '100%', backgroundColor: '#f8f9fa', borderLeft: '2px solid #dee2e6', display: 'flex', flexDirection: 'column' }}>

        {/* Schermata dei Risultati */}
        {gameResult ? (
          <MissionReport 
            result={gameResult} 
            onRestart={() => {
              setGameResult(null);
              setMission(null);
              setSelectedSegments([]);
              setTimeLeft(90);
            }} 
          />
        ) : (
          <div className="p-4 d-flex flex-column h-100">
            {isPlaying && <TimerComponent timeLeft={timeLeft} maxTime={90} />}

            <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
              {isPlaying ? (
                <>
                  <div className="flex-grow-1" style={{ minHeight: 0, overflow: 'hidden' }}>
                    <SegmentHandler
                      rawData={rawData}
                      mission={mission}
                      selectedSegments={selectedSegments}
                      onSegmentClick={handleSegmentClick}
                    />
                  </div>
                  <div className="mt-3 mb-2 d-flex justify-content-center w-100">
                    <ButtonComponent 
                      text="TRASMETTI" 
                      colorVar="--secondary" 
                      onClick={handleSubmission} 
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
                  text="ESEGUI" 
                  colorVar="--quinary" 
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
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;
