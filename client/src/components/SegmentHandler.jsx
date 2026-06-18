import React from 'react';
import Segment from './Segment';
import InterceptedMission from './InterceptedMission';

const SegmentHandler = ({ rawData, mission, selectedSegments = [], onSegmentClick }) => {
  const segments = () => {
    // ... logic remains untouched ...
    if (!rawData || rawData.length === 0) return [];

    const lines = {};

    // Raggruppa le stazioni per linea
    rawData.forEach(row => {
      if (!lines[row.line_id]) {
        lines[row.line_id] = {
          lineName: row.line_name,
          color: row.color,
          stops: []
        };
      }
      lines[row.line_id].stops.push({
        stationId: row.station_id,
        stationName: row.station_name,
        order: row.stop_order
      });
    });

    const extractedSegments = [];

    // Per ogni linea, ordina le fermate e crea i segmenti contigui
    Object.values(lines).forEach(line => {
      line.stops.sort((a, b) => a.order - b.order);

      for (let i = 0; i < line.stops.length - 1; i++) {
        extractedSegments.push({
          id: `${line.lineName}-${i}`, // chiave univoca
          fromId: line.stops[i].stationId,
          toId: line.stops[i+1].stationId,
          from: line.stops[i].stationName,
          to: line.stops[i + 1].stationName,
          color: line.color,
          lineName: line.lineName
        });
      }
    });

    // Sposta i segmenti cliccati/selezionati in cima alla lista
    extractedSegments.sort((a, b) => {
      const aIndex = selectedSegments.findIndex(s => s.id === a.id);
      const bIndex = selectedSegments.findIndex(s => s.id === b.id);

      const aIsSelected = aIndex !== -1;
      const bIsSelected = bIndex !== -1;

      if (aIsSelected && !bIsSelected) return -1;
      if (!aIsSelected && bIsSelected) return 1;

      // Se entrambi sono selezionati, mantieni l'ordine in cui sono stati cliccati
      if (aIsSelected && bIsSelected) return aIndex - bIndex;

      return 0; // Se nessuno dei due è selezionato, lascia l'ordine originale
    });

    return extractedSegments;
  }

  return (
    <div className="d-flex flex-column h-100">

      {/* Box della Missione */}
      <InterceptedMission mission={mission} />

      {/* Lista dei Segmenti */}
      <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
      <div className="flex-grow-1 hide-scroll" style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {segments().map(seg => (
          <Segment
            key={seg.id}
            segment={seg}
            isSelected={selectedSegments.some(s => s.id === seg.id)}
            onClick={onSegmentClick}
          />
        ))}
        {segments().length === 0 && (
          <div className="text-muted text-center mt-4">Nessun segmento disponibile.</div>
        )}
      </div>

    </div>
  );
};

export default SegmentHandler;
