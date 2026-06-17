import sqlite3 from "sqlite3";
import crypto from "crypto";
import path from "path";

// Open the database using an absolute path relative to this file
// (resolves to database.db in the root directory)
const dbFile = path.join(import.meta.dirname, "../database.db");
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        process.exit(1);
    }
    console.log("Connected to SQLite database.");
});

export const getNetwork = () => {
    const sql = `
    SELECT l.line_id, l.line_name, l.color, s.station_id, s.station_name, sl.stop_order
    FROM stations AS s
    JOIN station_line AS sl ON s.station_id = sl.station_id
    JOIN lines AS l ON l.line_id = sl.line_id
    ORDER BY l.line_id, sl.stop_order
    `;
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Get the ranking (best score for each user)
export const getBestScores = () => {
    const sql = `
        SELECT username, MAX(score) AS score 
        FROM games 
        GROUP BY username 
        ORDER BY score DESC
    `;
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Get the list of all random events with their details and weights
export const getEvents = () => {
    const sql = `SELECT * FROM events`;
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Save a new game score
export const saveGame = (username, score) => {
    const sql = "INSERT INTO games (username, score) VALUES (?, ?)";
    return new Promise((resolve, reject) => {
        db.run(sql, [username, score], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
}

//get user from the database for login
export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE username = ?";
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = { id: row.id, username: row.username };
                crypto.scrypt(password, row.salt, 16, function (err, hashedPassword) {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.password, "hex"), hashedPassword))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });
};