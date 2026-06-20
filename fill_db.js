const sqlite = require('sqlite3');
const crypto = require('crypto');

// Open the database file
const db = new sqlite.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

// Helper to hash password using scrypt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashed = crypto.scryptSync(password, salt, 16).toString('hex');
  return { salt, hashed };
}

db.serialize(() => {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;');

  console.log('Dropping existing tables...');
  db.run('DROP TABLE IF EXISTS "games";');
  db.run('DROP TABLE IF EXISTS "station_line";');
  db.run('DROP TABLE IF EXISTS "lines";');
  db.run('DROP TABLE IF EXISTS "stations";');
  db.run('DROP TABLE IF EXISTS "events";');
  db.run('DROP TABLE IF EXISTS "user";');

  console.log('Creating tables...');

  // 1. Table User
  db.run(`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" INTEGER NOT NULL,
      "username" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "salt" TEXT NOT NULL,
      PRIMARY KEY("id" AUTOINCREMENT)
    );
  `);

  // 2. Table Stations
  db.run(`
    CREATE TABLE IF NOT EXISTS "stations" (
      "station_id" INTEGER NOT NULL,
      "station_name" TEXT NOT NULL UNIQUE,
      PRIMARY KEY("station_id" AUTOINCREMENT)
    );
  `);

  // 3. Table Lines
  db.run(`
    CREATE TABLE IF NOT EXISTS "lines" (
      "line_id" INTEGER NOT NULL,
      "line_name" TEXT NOT NULL UNIQUE,
      "color" TEXT NOT NULL UNIQUE,
      PRIMARY KEY("line_id" AUTOINCREMENT)
    );
  `);

  // 4. Table Station-Line Junction Table
  db.run(`
    CREATE TABLE IF NOT EXISTS "station_line" (
      "station_id" INTEGER NOT NULL,
      "line_id" INTEGER NOT NULL,
      "stop_order" INTEGER NOT NULL,
      PRIMARY KEY("station_id", "line_id"),
      FOREIGN KEY("station_id") REFERENCES "stations"("station_id") ON DELETE CASCADE,
      FOREIGN KEY("line_id") REFERENCES "lines"("line_id") ON DELETE CASCADE
    );
  `);

  // 5. Table Events
  db.run(`
    CREATE TABLE IF NOT EXISTS "events" (
      "event_id" INTEGER NOT NULL,
      "event_name" TEXT NOT NULL UNIQUE,
      "bonus" INTEGER NOT NULL CHECK("bonus" BETWEEN -4 AND 4),
      "weight" INTEGER NOT NULL CHECK("weight" > 0),
      PRIMARY KEY("event_id" AUTOINCREMENT)
    );
  `);

  // 6. Table Games
  db.run(`
    CREATE TABLE IF NOT EXISTS "games" (
      "game_id" INTEGER NOT NULL,
      "username" TEXT NOT NULL,
      "score" INTEGER NOT NULL CHECK("score" >= 0),
      PRIMARY KEY("game_id" AUTOINCREMENT),
      FOREIGN KEY("username") REFERENCES "user"("username") ON DELETE CASCADE
    );
  `);

  console.log('Tables created successfully. Seeding data...');

  // Seed Users
  const userStmt = db.prepare('INSERT INTO user (username, password, salt) VALUES (?, ?, ?)');
  const users = [
    { username: 'john_doe', password: 'password123' },
    { username: 'jane_smith', password: 'password123' },
    { username: 'alice_wonder', password: 'password123' },
    { username: 'bob_builder', password: 'password123' } // This user will have no scores
  ];

  users.forEach((u) => {
    const { salt, hashed } = hashPassword(u.password);
    userStmt.run(u.username, hashed, salt);
  });
  userStmt.finalize();
  console.log('Seeded users.');

  // Seed Stations
  const stationStmt = db.prepare('INSERT INTO stations (station_id, station_name) VALUES (?, ?)');
  const stationNames = [
    { id: 1, name: 'Notting Hill Gate' },
    { id: 2, name: 'Queensway' },
    { id: 3, name: 'Lancaster Gate' },
    { id: 4, name: 'Marble Arch' },
    { id: 5, name: 'Bond Street' },
    { id: 6, name: 'Oxford Circus' },
    { id: 7, name: 'Tottenham Court Road' },
    { id: 8, name: 'Holborn' },
    { id: 9, name: 'Chancery Lane' },
    { id: 10, name: "St. Paul's" },
    { id: 11, name: 'Bank' },
    { id: 12, name: 'Liverpool Street' },
    { id: 13, name: 'Victoria' },
    { id: 14, name: 'Green Park' },
    { id: 15, name: 'Warren Street' },
    { id: 16, name: 'Euston' },
    { id: 17, name: "King's Cross St. Pancras" },
    { id: 18, name: 'South Kensington' },
    { id: 19, name: 'Knightsbridge' },
    { id: 20, name: 'Hyde Park Corner' },
    { id: 21, name: 'Piccadilly Circus' },
    { id: 22, name: 'Leicester Square' },
    { id: 23, name: 'Covent Garden' },
    { id: 24, name: 'Russell Square' },
    { id: 25, name: 'Waterloo' },
    { id: 26, name: 'Charing Cross' },
    { id: 27, name: 'Goodge Street' },
    { id: 28, name: 'Westminster' },
    { id: 29, name: 'Baker Street' }
  ];

  stationNames.forEach((st) => {
    stationStmt.run(st.id, st.name);
  });
  stationStmt.finalize();
  console.log('Seeded stations.');

  // Seed Lines
  const lineStmt = db.prepare('INSERT INTO lines (line_id, line_name, color) VALUES (?, ?, ?)');
  const linesData = [
    { id: 1, name: 'Central Line', color: '#E32017' },
    { id: 2, name: 'Victoria Line', color: '#0098D4' },
    { id: 3, name: 'Piccadilly Line', color: '#003688' },
    { id: 4, name: 'Northern Line', color: '#000000' },
    { id: 5, name: 'Jubilee Line', color: '#A0A5A9' }
  ];

  linesData.forEach((line) => {
    lineStmt.run(line.id, line.name, line.color);
  });
  lineStmt.finalize();
  console.log('Seeded lines.');

  // Seed Station-Line connections
  const stopStmt = db.prepare('INSERT INTO station_line (line_id, station_id, stop_order) VALUES (?, ?, ?)');
  const stops = [
    // Central Line
    { line_id: 1, station_id: 1, stop_order: 1 },
    { line_id: 1, station_id: 2, stop_order: 2 },
    { line_id: 1, station_id: 3, stop_order: 3 },
    { line_id: 1, station_id: 4, stop_order: 4 },
    { line_id: 1, station_id: 5, stop_order: 5 },
    { line_id: 1, station_id: 6, stop_order: 6 },
    { line_id: 1, station_id: 7, stop_order: 7 },
    { line_id: 1, station_id: 8, stop_order: 8 },
    { line_id: 1, station_id: 9, stop_order: 9 },
    { line_id: 1, station_id: 10, stop_order: 10 },
    { line_id: 1, station_id: 11, stop_order: 11 },
    { line_id: 1, station_id: 12, stop_order: 12 },

    // Victoria Line
    { line_id: 2, station_id: 13, stop_order: 1 },
    { line_id: 2, station_id: 14, stop_order: 2 },
    { line_id: 2, station_id: 6, stop_order: 3 },
    { line_id: 2, station_id: 15, stop_order: 4 },
    { line_id: 2, station_id: 16, stop_order: 5 },
    { line_id: 2, station_id: 17, stop_order: 6 },

    // Piccadilly Line
    { line_id: 3, station_id: 18, stop_order: 1 },
    { line_id: 3, station_id: 19, stop_order: 2 },
    { line_id: 3, station_id: 20, stop_order: 3 },
    { line_id: 3, station_id: 14, stop_order: 4 },
    { line_id: 3, station_id: 21, stop_order: 5 },
    { line_id: 3, station_id: 22, stop_order: 6 },
    { line_id: 3, station_id: 23, stop_order: 7 },
    { line_id: 3, station_id: 8, stop_order: 8 },
    { line_id: 3, station_id: 24, stop_order: 9 },
    { line_id: 3, station_id: 17, stop_order: 10 },

    // Northern Line
    { line_id: 4, station_id: 25, stop_order: 1 },
    { line_id: 4, station_id: 26, stop_order: 2 },
    { line_id: 4, station_id: 22, stop_order: 3 },
    { line_id: 4, station_id: 7, stop_order: 4 },
    { line_id: 4, station_id: 27, stop_order: 5 },
    { line_id: 4, station_id: 15, stop_order: 6 },
    { line_id: 4, station_id: 16, stop_order: 7 },
    { line_id: 4, station_id: 17, stop_order: 8 },

    // Jubilee Line
    { line_id: 5, station_id: 28, stop_order: 1 },
    { line_id: 5, station_id: 14, stop_order: 2 },
    { line_id: 5, station_id: 5, stop_order: 3 },
    { line_id: 5, station_id: 29, stop_order: 4 }
  ];

  stops.forEach((stop) => {
    stopStmt.run(stop.line_id, stop.station_id, stop.stop_order);
  });
  stopStmt.finalize();
  console.log('Seeded station_line stops.');

  // Seed Events
  const eventStmt = db.prepare('INSERT INTO events (event_name, bonus, weight) VALUES (?, ?, ?)');
  const eventsData = [
    { name: 'Agency informant provided a shortcut.', bonus: 3, weight: 4 },
    { name: 'Intercepted a clear radio frequency. Smooth travel.', bonus: 2, weight: 5 },
    { name: 'The train doors stayed open just for you.', bonus: 1, weight: 6 },
    { name: 'Police patrol sweeping carriages. You had to hide.', bonus: -2, weight: 5 },
    { name: 'Caught without a ticket by transit police! Extensive background check.', bonus: -4, weight: 2 },
    { name: 'Boarded without paying. Fined and questioned by security.', bonus: -3, weight: 3 },
    { name: 'Missed the train. Waiting for the next one.', bonus: -2, weight: 6 },
    { name: 'Severe signal failure on the line.', bonus: -3, weight: 3 },
    { name: 'Track maintenance slowing down the journey.', bonus: -1, weight: 5 },
    { name: 'Undercover agents spotted at the platform. Detour required.', bonus: -2, weight: 4 }
  ];

  eventsData.forEach((ev) => {
    eventStmt.run(ev.name, ev.bonus, ev.weight);
  });
  eventStmt.finalize();
  console.log('Seeded events.');

  // Seed Games
  const gameStmt = db.prepare('INSERT INTO games (username, score) VALUES (?, ?)');
  const gamesData = [
    { username: 'john_doe', score: 35 },
    { username: 'john_doe', score: 42 },
    { username: 'jane_smith', score: 28 },
    { username: 'alice_wonder', score: 15 },
    { username: 'alice_wonder', score: 50 },
    { username: 'alice_wonder', score: 33 }
    // bob_builder has no scores
  ];

  gamesData.forEach((game) => {
    gameStmt.run(game.username, game.score);
  });
  gameStmt.finalize();
  console.log('Seeded games.');

  console.log('Database initialization completed successfully!');
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Closed database connection.');
  }
});
