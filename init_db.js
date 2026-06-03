const sqlite = require('sqlite3');

// Open the database file
const db = new sqlite.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

// Helper to hash password using standard pbkdf2 algorithm
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashed = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
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
      "username" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "salt" TEXT NOT NULL,
      PRIMARY KEY("username")
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
});

