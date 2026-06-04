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

// Helper to hash password using scrypt (matching the professor's getUser)
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

  // 1. Table User (has id, username, password, salt to match getUser requirements)
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

  // 5. Table Events (with bonus and weight CHECK constraints)
  db.run(`
    CREATE TABLE IF NOT EXISTS "events" (
      "event_id" INTEGER NOT NULL,
      "event_name" TEXT NOT NULL UNIQUE,
      "bonus" INTEGER NOT NULL CHECK("bonus" BETWEEN -4 AND 4),
      "weight" INTEGER NOT NULL CHECK("weight" > 0),
      PRIMARY KEY("event_id" AUTOINCREMENT)
    );
  `);

  // 6. Table Games (to store match history)
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
    { username: 'user1', password: 'password' },
    { username: 'user2', password: 'password' },
    { username: 'user3', password: 'password' },
  ];

  users.forEach((u) => {
    const { salt, hashed } = hashPassword(u.password);
    userStmt.run(u.username, hashed, salt);
  });
  userStmt.finalize();
  console.log('Seeded users.');

  // Seed Stations (13 stations)
  const stationStmt = db.prepare('INSERT INTO stations (station_name) VALUES (?)');
  const stationNames = [
    'Centrale',            // ID 1
    'Porta Velaria',       // ID 2
    'Crocevia del Falco',  // ID 3
    'Piazza delle Lanterne',// ID 4
    'Fontana Oscura',      // ID 5
    'Borgo Sereno',        // ID 6
    'Viale dei Mosaici',   // ID 7
    'Torre Cinerea',       // ID 8
    'Campo dell\'Eco',     // ID 9
    'Stazione Ovest',      // ID 10
    'Stazione Est',        // ID 11
    'Stazione Sud',        // ID 12
    'Stazione Nord'        // ID 13
  ];

  stationNames.forEach((name) => {
    stationStmt.run(name);
  });
  stationStmt.finalize();
  console.log('Seeded stations.');

  // Seed Lines (4 lines)
  const lineStmt = db.prepare('INSERT INTO lines (line_name, color) VALUES (?, ?)');
  const linesData = [
    { name: 'Red Line', color: '#E53E3E' },
    { name: 'Blue Line', color: '#3182CE' },
    { name: 'Green Line', color: '#38A169' },
    { name: 'Yellow Line', color: '#D69E2E' }
  ];

  linesData.forEach((line) => {
    lineStmt.run(line.name, line.color);
  });
  lineStmt.finalize();
  console.log('Seeded lines.');

  // Seed Station-Line connections
  const stopStmt = db.prepare('INSERT INTO station_line (line_id, station_id, stop_order) VALUES (?, ?, ?)');
  const stops = [
    // Red Line (line_id: 1)
    { line_id: 1, station_id: 1, stop_order: 1 },  // Centrale
    { line_id: 1, station_id: 2, stop_order: 2 },  // Porta Velaria
    { line_id: 1, station_id: 3, stop_order: 3 },  // Crocevia del Falco
    { line_id: 1, station_id: 4, stop_order: 4 },  // Piazza delle Lanterne
    { line_id: 1, station_id: 10, stop_order: 5 }, // Stazione Ovest

    // Blue Line (line_id: 2)
    { line_id: 2, station_id: 1, stop_order: 1 },  // Centrale
    { line_id: 2, station_id: 5, stop_order: 2 },  // Fontana Oscura
    { line_id: 2, station_id: 6, stop_order: 3 },  // Borgo Sereno
    { line_id: 2, station_id: 7, stop_order: 4 },  // Viale dei Mosaici
    { line_id: 2, station_id: 11, stop_order: 5 }, // Stazione Est

    // Green Line (line_id: 3)
    { line_id: 3, station_id: 2, stop_order: 1 },  // Porta Velaria
    { line_id: 3, station_id: 5, stop_order: 2 },  // Fontana Oscura
    { line_id: 3, station_id: 8, stop_order: 3 },  // Torre Cinerea
    { line_id: 3, station_id: 9, stop_order: 4 },  // Campo dell'Eco
    { line_id: 3, station_id: 12, stop_order: 5 }, // Stazione Sud

    // Yellow Line (line_id: 4)
    { line_id: 4, station_id: 4, stop_order: 1 },  // Piazza delle Lanterne
    { line_id: 4, station_id: 8, stop_order: 2 },  // Torre Cinerea
    { line_id: 4, station_id: 7, stop_order: 3 },  // Viale dei Mosaici
    { line_id: 4, station_id: 9, stop_order: 4 },  // Campo dell'Eco
    { line_id: 4, station_id: 13, stop_order: 5 }  // Stazione Nord
  ];

  stops.forEach((stop) => {
    stopStmt.run(stop.line_id, stop.station_id, stop.stop_order);
  });
  stopStmt.finalize();
  console.log('Seeded station_line stops.');

  // Seed Events (10 events)
  const eventStmt = db.prepare('INSERT INTO events (event_name, bonus, weight) VALUES (?, ?, ?)');
  const eventsData = [
    { name: 'Quiet journey', bonus: 0, weight: 10 },
    { name: 'Wrong platform', bonus: -2, weight: 3 },
    { name: 'Kind passenger', bonus: 1, weight: 4 },
    { name: 'Controller check - Ticket valid', bonus: 0, weight: 6 },
    { name: 'Pickpocket', bonus: -3, weight: 2 },
    { name: 'Found a coin', bonus: 1, weight: 4 },
    { name: 'Strikes / Delay', bonus: -1, weight: 5 },
    { name: 'Fast connection', bonus: 2, weight: 3 },
    { name: 'Severe disruption', bonus: -4, weight: 1 },
    { name: 'Jackpot on the floor', bonus: 4, weight: 1 }
  ];

  eventsData.forEach((ev) => {
    eventStmt.run(ev.name, ev.bonus, ev.weight);
  });
  eventStmt.finalize();
  console.log('Seeded events.');

  // Seed Games (at least 2 users with games played)
  const gameStmt = db.prepare('INSERT INTO games (username, score) VALUES (?, ?)');
  const gamesData = [
    { username: 'user1', score: 18 },
    { username: 'user1', score: 22 },
    { username: 'user2', score: 15 },
    { username: 'user2', score: 8 }
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
