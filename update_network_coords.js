const sqlite = require('sqlite3');

const db = new sqlite.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;');

  console.log('Adding lat and lng columns to stations if they do not exist...');
    console.log('Clearing existing network data...');
    db.run('DELETE FROM "station_line";');
    db.run('DELETE FROM "lines";');
    db.run('DELETE FROM "stations";');

    console.log('Seeding network with coordinates...');

    // 1. Inserimento Stazioni
    const stationStmt = db.prepare('INSERT INTO stations (station_id, station_name, lat, lng) VALUES (?, ?, ?, ?)');
    const stationNames = [
      { id: 1, name: 'Notting Hill Gate', lat: 51.5091, lng: -0.1961 },
      { id: 2, name: 'Queensway', lat: 51.5103, lng: -0.1873 },
      { id: 3, name: 'Lancaster Gate', lat: 51.5117, lng: -0.1755 },
      { id: 4, name: 'Marble Arch', lat: 51.5133, lng: -0.1586 },
      { id: 5, name: 'Oxford Circus', lat: 51.5150, lng: -0.1415 },
      { id: 6, name: 'Tottenham Court Road', lat: 51.5165, lng: -0.1310 },
      { id: 7, name: 'Holborn', lat: 51.5174, lng: -0.1198 },
      { id: 8, name: 'Pimlico', lat: 51.4893, lng: -0.1334 },
      { id: 9, name: 'Victoria', lat: 51.4964, lng: -0.1439 },
      { id: 10, name: 'Green Park', lat: 51.5067, lng: -0.1428 },
      { id: 11, name: 'Warren Street', lat: 51.5247, lng: -0.1384 },
      { id: 12, name: 'Euston', lat: 51.5281, lng: -0.1336 },
      { id: 13, name: 'Sloane Square', lat: 51.4923, lng: -0.1565 },
      { id: 14, name: "St. James's Park", lat: 51.4994, lng: -0.1335 },
      { id: 15, name: 'Westminster', lat: 51.5010, lng: -0.1254 },
      { id: 16, name: 'Embankment', lat: 51.5074, lng: -0.1223 },
      { id: 17, name: 'Temple', lat: 51.5111, lng: -0.1141 },
      { id: 18, name: 'Blackfriars', lat: 51.5116, lng: -0.1036 },
      { id: 19, name: 'Baker Street', lat: 51.5231, lng: -0.1566 },
      { id: 20, name: 'Bond Street', lat: 51.5142, lng: -0.1494 },
      { id: 21, name: 'Waterloo', lat: 51.5036, lng: -0.1143 },
      { id: 22, name: 'London Bridge', lat: 51.5055, lng: -0.0860 }
    ];

    stationNames.forEach(st => stationStmt.run(st.id, st.name, st.lat, st.lng));
    stationStmt.finalize();

    // 2. Inserimento Linee
    const lineStmt = db.prepare('INSERT INTO lines (line_id, line_name, color) VALUES (?, ?, ?)');
    const linesData = [
      { id: 1, name: 'Central Line', color: '#E32017' },
      { id: 2, name: 'Victoria Line', color: '#0098D4' },
      { id: 3, name: 'District Line', color: '#00782A' },
      { id: 4, name: 'Jubilee Line', color: '#A0A5A9' }
    ];

    linesData.forEach(line => lineStmt.run(line.id, line.name, line.color));
    lineStmt.finalize();

    // 3. Inserimento Fermate (Ordinamento)
    const stopStmt = db.prepare('INSERT INTO station_line (line_id, station_id, stop_order) VALUES (?, ?, ?)');
    const stops = [
      // Central Line
      { line_id: 1, station_id: 1, stop_order: 1 },
      { line_id: 1, station_id: 2, stop_order: 2 },
      { line_id: 1, station_id: 3, stop_order: 3 },
      { line_id: 1, station_id: 4, stop_order: 4 },
      { line_id: 1, station_id: 20, stop_order: 5 }, // Bond Street (Interscambio con Jubilee)
      { line_id: 1, station_id: 5, stop_order: 6 }, // Oxford Circus
      { line_id: 1, station_id: 6, stop_order: 7 },
      { line_id: 1, station_id: 7, stop_order: 8 },

      // Victoria Line
      { line_id: 2, station_id: 8, stop_order: 1 },
      { line_id: 2, station_id: 9, stop_order: 2 }, // Victoria
      { line_id: 2, station_id: 10, stop_order: 3 },
      { line_id: 2, station_id: 5, stop_order: 4 }, // Oxford Circus
      { line_id: 2, station_id: 11, stop_order: 5 },
      { line_id: 2, station_id: 12, stop_order: 6 },

      // District Line 
      { line_id: 3, station_id: 13, stop_order: 1 }, // Sloane Square
      { line_id: 3, station_id: 9, stop_order: 2 },  // Victoria (Interscambio con Victoria Line)
      { line_id: 3, station_id: 14, stop_order: 3 }, // St. James's Park
      { line_id: 3, station_id: 15, stop_order: 4 }, // Westminster (Interscambio con Jubilee)
      { line_id: 3, station_id: 16, stop_order: 5 }, // Embankment
      { line_id: 3, station_id: 17, stop_order: 6 }, // Temple
      { line_id: 3, station_id: 18, stop_order: 7 }, // Blackfriars

      // Jubilee Line
      { line_id: 4, station_id: 19, stop_order: 1 }, // Baker Street
      { line_id: 4, station_id: 20, stop_order: 2 }, // Bond Street (Interscambio con Central)
      { line_id: 4, station_id: 15, stop_order: 3 }, // Westminster (Interscambio con District)
      { line_id: 4, station_id: 21, stop_order: 4 }, // Waterloo
      { line_id: 4, station_id: 22, stop_order: 5 }  // London Bridge
    ];

    stops.forEach(stop => stopStmt.run(stop.line_id, stop.station_id, stop.stop_order));
    stopStmt.finalize();

    console.log('Database successfully updated with the network and coordinates!');
});

db.close();
