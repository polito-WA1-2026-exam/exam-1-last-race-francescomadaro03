
import Segment from './Segment';

const SegmentHandler = ({ rawData, mission, selectedSegments = [], onSegmentClick }) => {

  const segments = () => {
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
      {mission && (
        <div className="card shadow-sm border-0 mb-3 bg-dark text-white">
          <div className="card-body text-center p-3">
            <h5 className="mb-2 text-warning">🏁 La tua Missione</h5>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="fw-bold fs-5">{mission.start.name}</div>
              <div className="fs-3 text-muted mx-2">✈️</div>
              <div className="fw-bold fs-5">{mission.end.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Lista dei Segmenti (Scrollabile) */}
      <h5 className="mb-3 text-muted">Tratte Disponibili:</h5>
      <div className="flex-grow-1" style={{ overflowY: 'auto', paddingRight: '5px' }}>
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
