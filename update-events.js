import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error("Errore nell'apertura del database:", err.message);
        process.exit(1);
    }
    console.log("Connesso al database SQLite.");
});

const newEvents = [
    { name: "Percorso sotterraneo sicuro, nessun controllo del Partito", bonus: 1, weight: 35 },
    { name: "Evitato checkpoint della Polizia del Pensiero", bonus: 2, weight: 20 },
    { name: "Contatto ribelle ti ha fornito un salvacondotto", bonus: 3, weight: 10 },
    { name: "Intercettati documenti segreti del Grande Fratello", bonus: 4, weight: 5 },
    { name: "Niente da segnalare. Il viaggio prosegue", bonus: 0, weight: 40 },
    { name: "Telecamere attive, hai dovuto nasconderti", bonus: -1, weight: 30 },
    { name: "Controllo a sorpresa delle Guardie Rosse", bonus: -2, weight: 20 },
    { name: "Informatore a bordo, fuga precipitosa!", bonus: -3, weight: 10 },
    { name: "Imboscata sfiorata! Hai perso informazioni vitali", bonus: -4, weight: 5 }
];

db.serialize(() => {
    // Svuota la tabella attuale degli eventi
    db.run("DELETE FROM events", (err) => {
        if (err) {
            console.error("Errore durante la cancellazione degli eventi:", err.message);
        } else {
            console.log("Vecchi eventi cancellati con successo.");
        }
    });

    // Inserisci i nuovi eventi
    const stmt = db.prepare("INSERT INTO events (event_name, bonus, weight) VALUES (?, ?, ?)");
    
    newEvents.forEach((event) => {
        stmt.run([event.name, event.bonus, event.weight], (err) => {
            if (err) {
                console.error(`Errore nell'inserimento dell'evento "${event.name}":`, err.message);
            } else {
                console.log(`Evento "${event.name}" inserito.`);
            }
        });
    });
    
    stmt.finalize(() => {
        console.log("Aggiornamento degli eventi completato.");
        db.close();
    });
});
