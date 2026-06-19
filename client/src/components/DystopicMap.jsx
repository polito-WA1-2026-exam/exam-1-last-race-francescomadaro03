import React, { useEffect, useState } from 'react';
import LondonMap from '../assets/LondonMap.png';
import { mapCoordinatesInSpace } from '../edges';

let cachedNetwork = null;

export default function DystopicMap({ fetchStations, showLines = true }) {
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
      const stationsMap = new Map();
      const lines = {};
      const lineIds = new Set();

      rawData.forEach(row => {
        if (!stationsMap.has(row.station_id)) {
          stationsMap.set(row.station_id, {
            id: row.station_id,
            name: row.station_name,
            lat: row.lat,
            lng: row.lng,
            lines: new Set()
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

      nodes.forEach(n => {
        n.isInterchange = n.lines.size > 1;
        n.r = n.isInterchange ? 12 : 8;

        // Map coordinates to SVG space (1000x800)
        const coords = mapCoordinatesInSpace(n.lat, n.lng, 1000, 800);
        n.vx = coords.x;
        n.vy = coords.y;
      });

      const visualLines = [];
      lineIds.forEach((lId) => {
        const stops = lines[lId].stops.sort((a, b) => a.stop_order - b.stop_order);
        let pathD = "";
        stops.forEach((s, i) => {
          const st = stationsMap.get(s.station_id);
          const vx = st.vx;
          const vy = st.vy;
          if (i === 0) pathD += `M ${vx} ${vy} `;
          else pathD += `L ${vx} ${vy} `;
        });
        visualLines.push({ id: lId, color: lines[lId].color, d: pathD });
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
  }, []);

  if (loading) return <div>Loading dystopic map...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!network) return null;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: 'var(--quinary)', borderRadius: '8px', position: 'relative', padding: '20px', boxSizing: 'border-box' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 800"
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <image href={LondonMap} x="0" y="0" width="1000" height="800" preserveAspectRatio="none" />

        {/* Draw Simple Lines Conditionally */}
        {showLines && network.visualLines.map(line => {
          return (
            <path
              key={`line-${line.id}`}
              d={line.d}
              fill="none"
              stroke={line.color}
              strokeWidth="6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}


        {network.nodes.map(node => {
          let tx = node.vx;
          let ty = node.vy + (node.id % 2 === 0 ? -(node.r + 8) : (node.r + 20));

          if (node.name === 'Notting Hill Gate') {
            tx += 30; // Piccolo offset per non farlo uscire a sinistra
          }

          return (
            <g key={node.id}>
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight={node.isInterchange ? "bold" : "normal"}
                stroke="#000"
                strokeWidth="3"
                paintOrder="stroke"
                strokeLinejoin="round"
              >
                {node.name}
              </text>

              <circle
                cx={node.vx}
                cy={node.vy}
                r={node.r}
                fill="#fff"
                stroke="#000"
                strokeWidth="3"
                style={{ transition: 'all 0.3s ease' }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
