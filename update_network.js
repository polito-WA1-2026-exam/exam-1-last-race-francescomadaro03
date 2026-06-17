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

  console.log('Clearing existing network data...');
  db.run('DELETE FROM "station_line";');
  db.run('DELETE FROM "lines";');
  db.run('DELETE FROM "stations";');

  console.log('Seeding reduced network...');

  // 1. Inserimento Stazioni
  const stationStmt = db.prepare('INSERT INTO stations (station_id, station_name) VALUES (?, ?)');
  const stationNames = [
    // Central Line exclusives
    { id: 1, name: 'Notting Hill Gate' },
    { id: 2, name: 'Queensway' },
    { id: 3, name: 'Lancaster Gate' },
    { id: 4, name: 'Marble Arch' },
    // Interchange 1
    { id: 5, name: 'Oxford Circus' },
    // Central Line exclusives (cont.)
    { id: 6, name: 'Tottenham Court Road' },
    { id: 7, name: 'Holborn' },

    // Victoria Line exclusives
    { id: 8, name: 'Pimlico' },
    // Interchange 2
    { id: 9, name: 'Victoria' },
    // Victoria Line exclusives (cont.)
    { id: 10, name: 'Green Park' },
    { id: 11, name: 'Warren Street' },
    { id: 12, name: 'Euston' },

    // District Line exclusives
    { id: 13, name: 'Sloane Square' },
    { id: 14, name: "St. James's Park" },
    // Interchange 4 (District & Jubilee)
    { id: 15, name: 'Westminster' },
    // District Line exclusives (cont.)
    { id: 16, name: 'Embankment' },
    { id: 17, name: 'Temple' },
    { id: 18, name: 'Blackfriars' },

    // Jubilee Line exclusives
    { id: 19, name: 'Baker Street' },
    // Interchange 3 (Central & Jubilee)
    { id: 20, name: 'Bond Street' },
    // Jubilee Line exclusives (cont.)
    { id: 21, name: 'Waterloo' },
    { id: 22, name: 'London Bridge' }
  ];

  stationNames.forEach(st => stationStmt.run(st.id, st.name));
  stationStmt.finalize();

  // 2. Inserimento Linee (Aumentate a 4)
  const lineStmt = db.prepare('INSERT INTO lines (line_id, line_name, color) VALUES (?, ?, ?)');
  const linesData = [
    { id: 1, name: 'Central Line', color: '#E32017' },
    { id: 2, name: 'Victoria Line', color: '#0098D4' },
    { id: 3, name: 'District Line', color: '#00782A' },
    { id: 4, name: 'Jubilee Line', color: '#A0A5A9' } // Nuova Linea Aggiunta
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

    // Jubilee Line (Nuova Linea)
    { line_id: 4, station_id: 19, stop_order: 1 }, // Baker Street
    { line_id: 4, station_id: 20, stop_order: 2 }, // Bond Street (Interscambio con Central)
    { line_id: 4, station_id: 15, stop_order: 3 }, // Westminster (Interscambio con District)
    { line_id: 4, station_id: 21, stop_order: 4 }, // Waterloo
    { line_id: 4, station_id: 22, stop_order: 5 }  // London Bridge
  ];

  stops.forEach(stop => stopStmt.run(stop.line_id, stop.station_id, stop.stop_order));
  stopStmt.finalize();

  console.log('Database successfully updated with the reduced custom network!');
});

db.close();
