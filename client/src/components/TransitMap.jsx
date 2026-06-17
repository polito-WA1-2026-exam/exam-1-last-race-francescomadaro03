import React, { useEffect, useState } from 'react';

const COLS = 120;
const ROWS = 60;
const TILE = 30;
const PAD_X = 4; // ridotto padding logico ai bordi

let cachedNetwork = null;

export default function TransitMap({ fetchStations, showLines = true }) {
  const [network, setNetwork] = useState(cachedNetwork);
  const [loading, setLoading] = useState(!cachedNetwork);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedNetwork) {
      setNetwork(cachedNetwork);
      setLoading(false);
      return;
    }

    let mounted = true;

    fetchStations().then(rawData => {
      // 1. Costruzione Strutture Dati di Base
      const stationsMap = new Map();
      const lines = {};
      const lineIds = new Set();
      
      rawData.forEach(row => {
        if (!stationsMap.has(row.station_id)) {
          stationsMap.set(row.station_id, {
            id: row.station_id,
            name: row.station_name,
            lines: new Set(),
            x: undefined,
            y: undefined
          });
        }
        const st = stationsMap.get(row.station_id);
        st.lines.add(row.line_id);
        lineIds.add(row.line_id);

        if (!lines[row.line_id]) {
          lines[row.line_id] = { id: row.line_id, name: row.line_name, color: row.color, stops: [] };
        }
        lines[row.line_id].stops.push({ station_id: row.station_id, stop_order: row.stop_order });
      });

      const nodes = Array.from(stationsMap.values());
      
      // Identifica interscambi e calcola dimensioni
      nodes.forEach(n => {
        n.isInterchange = n.lines.size > 1;
        n.r = n.isInterchange ? 35 : 20; // Hub grandi, stazioni normali piccole
      });

      // 2. Posizionamento Matematico (Niente Random, Niente Cluster)
      // Ogni stazione si posiziona come media delle coordinate che avrebbe sulle singole linee.
      // L'asse X è dettato in proporzione dal "stop_order" (da sinistra verso destra).
      // L'asse Y è dettato dall'indice della linea (dall'alto verso il basso).
      
      const lineArray = Array.from(lineIds);
      const totalLines = lineArray.length;

      nodes.forEach(node => {
         let sumX = 0;
         let sumY = 0;
         let count = 0;

         node.lines.forEach(lId => {
            const lineIdx = lineArray.indexOf(lId);
            const lineInfo = lines[lId];
            const maxStops = lineInfo.stops.length;
            const stopInfo = lineInfo.stops.find(s => s.station_id === node.id);
            
            // Padding ai bordi
            const usableCols = COLS - PAD_X * 2;
            
            // Spaziatura intelligente e banale: la distanza non è fissa, 
            // ma proporzionale alla lunghezza del nome della stazione precedente.
            let totalWeight = 0;
            let myWeightSum = 0;

            lineInfo.stops.forEach(s => {
               const stName = stationsMap.get(s.station_id).name;
               // Peso base + un extra basato sulla lunghezza del testo
               const weight = 15 + stName.length; 
               
               if (s.stop_order < maxStops) {
                  totalWeight += weight;
               }
               if (s.stop_order < stopInfo.stop_order) {
                  myWeightSum += weight;
               }
            });

            // Progresso percentuale lungo la linea (da 0.0 a 1.0) pesato sui testi
            const progress = maxStops > 1 ? myWeightSum / totalWeight : 0.5;
            
            const px = PAD_X + (progress * usableCols);
            const py = ((lineIdx + 1) * ROWS) / (totalLines + 1);

            sumX += px;
            sumY += py;
            count++;
         });

         // Coordinate finali come baricentro matematico
         node.x = sumX / count;
         node.y = sumY / count;
      });

      // 5. Creazione Percorsi Visivi (Linee Dritte)
      const visualLines = [];
      lineIds.forEach((lId, lineIndex) => {
        const stops = lines[lId].stops;
        // Shift per non sovrapporre completamente le linee
        const shiftTiles = (lineIndex % 5 - 2) * 0.4;

        let pathD = "";
        stops.forEach((s, i) => {
           const st = stationsMap.get(s.station_id);
           // Se è un interscambio, le linee convergono perfettamente al centro. 
           // Altrimenti, seguono lo shift visivo della loro corsia.
           const vx = (st.isInterchange ? st.x : st.x + shiftTiles) * TILE;
           const vy = (st.isInterchange ? st.y : st.y + shiftTiles) * TILE;
           if (i === 0) pathD += `M ${vx} ${vy} `;
           else pathD += `L ${vx} ${vy} `;
        });

        visualLines.push({ id: lId, color: lines[lId].color, d: pathD });
      });

      // Assegna coordinate visive ai nodi (i pallini)
      nodes.forEach(n => {
         if (n.isInterchange) {
            n.vx = n.x;
            n.vy = n.y;
         } else {
            // Le stazioni esclusive si allineano perfettamente alla loro corsia shiftata
            const lId = Array.from(n.lines)[0];
            const lineIndex = lineArray.indexOf(lId);
            const shiftTiles = (lineIndex % 5 - 2) * 0.4;
            n.vx = n.x + shiftTiles;
            n.vy = n.y + shiftTiles;
         }
      });

      cachedNetwork = { nodes, visualLines, lines };
      setNetwork(cachedNetwork);
      setLoading(false);
    }).catch(err => {
      if (mounted) {
        setError(err.message);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [fetchStations]);

  if (loading) return <div>Caricamento rete in corso...</div>;
  if (error) return <div className="alert alert-danger">Errore: {error}</div>;
  if (!network) return null;

  const maxW = COLS * TILE;
  const maxH = ROWS * TILE;
  // Calcolo dinamico e "stretto" della viewBox per non sprecare spazio a sinistra
  const viewMinX = PAD_X * TILE - 50; 
  const viewWidth = (COLS - PAD_X * 2) * TILE + 600; // 600 extra a destra per far respirare i testi lunghi

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#f8f9fa', borderRadius: '8px', position: 'relative', padding: '1rem' }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`${viewMinX} -100 ${viewWidth} ${maxH + 200}`}
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
      >
        {/* Draw Simple Lines Conditionally */}
        {showLines && network.visualLines.map(line => {
           return (
            <path 
              key={`line-${line.id}`} 
              d={line.d} 
              fill="none" 
              stroke={line.color} 
              strokeWidth="14" 
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {/* Draw Stations and Text */}
        {network.nodes.map(node => {
          const cx = node.vx * TILE;
          const cy = node.vy * TILE;

          return (
            <g key={node.id}>
              {/* Testo ingrandito con alone/maschera liscia per tagliare le linee sottostanti */}
              <text 
                x={cx + (!showLines ? 25 : node.r) + 20} 
                y={cy - 12} 
                fill="#333" 
                fontSize="40"
                fontWeight={(!showLines) ? "normal" : (node.isInterchange ? "bold" : "normal")}
                stroke="#f8f9fa"
                strokeWidth="12"
                paintOrder="stroke"
                strokeLinejoin="round"
                style={{ 
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}
              >
                {node.name}
              </text>

              <circle 
                cx={cx} 
                cy={cy} 
                r={!showLines ? 25 : node.r} 
                fill="#fff" 
                stroke={!showLines ? '#333' : (node.isInterchange ? '#333' : Array.from(node.lines).map(lId => network.lines[lId].color)[0])} 
                strokeWidth={!showLines ? "4" : (node.isInterchange ? "6" : "4")}
                style={{ transition: 'all 0.3s ease' }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}