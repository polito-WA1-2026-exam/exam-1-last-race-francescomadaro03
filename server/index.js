import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUser, getBestScores, getEvents, getNetwork, saveGame } from "./dao.js"
import { User, Event, NetworkEntry, Game, } from "./models.js"


// init express
const app = express();
const port = 3001;


// Set up middlewares
app.use(morgan("dev"));
app.use(express.json());

// Set up CORS with credentials to allow session cookies
app.use(cors({
  origin: "http://localhost:5173", // React client Vite port
  credentials: true
}));


//authentication workflow
passport.use(new LocalStrategy(async function checkCredentials(username, password, cb) {
  try {
    const user = await getUser(username, password);

    if (!user) {
      return cb(null, false, "Wrong credentials. Access denied");
    }
    return cb(null, user);

  } catch (err) {
    return cb(err);
  }
}));

// Serialize/Deserialize user
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log(req.user)
  return res.status(401).json({ error: "Not authorized" });
}

// Set up Session
app.use(session({
  secret: "my beautiful webapp exam secret key...",
  resave: false, // avoids saving session on every request if unmodified
  saveUninitialized: false // avoids saving session if not initialized
}));
app.use(passport.initialize());
app.use(passport.session());

//ROUTES - authentication

// POST /api/sessions
app.post("/api/sessions", passport.authenticate("local"), function (req, res) {
  return res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// DELETE /api/session/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

import { buildDoubleLinkedList, generateRoute, validateSubmittedRoute, generateRandomEvents } from "./network-builder.js";

// Variabile globale per salvare la double-linked list
let globalGraph = null;

// ROUTES - game

app.get("/api/network", checkLoggedIn, async (req, res) => {
  try {
    // Il DAO prende i dati dal database
    const network = await getNetwork();
    
    // Costruiamo e salviamo la double-linked list nella variabile globale
    // (lo facciamo solo la prima volta, o la ricreiamo ogni volta, per sicurezza la salviamo)
    globalGraph = buildDoubleLinkedList(network);
    
    // E li mandiamo al frontend come richiesto
    return res.json(network);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error getting network data" });
  }
})

// Endpoint per ottenere il percorso casuale per l'inizio del gioco
app.post("/api/games/setup", checkLoggedIn, async (req, res) => {
  try {
    if (!globalGraph) {
      // Nel caso in cui il setup venga chiamato prima del network, lo carichiamo
      const network = await getNetwork();
      globalGraph = buildDoubleLinkedList(network);
    }
    
    const route = generateRoute(globalGraph);

    // SALVIAMO LE STAZIONI ASSEGNATE NELLA SESSIONE (Server-side)
    req.session.assignedRoute = {
      startId: route.start.id,
      endId: route.end.id
    };

    return res.json(route);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error generating random route" });
  }
})

// Endpoint per validare il percorso inviato dal client ed eseguire gli eventi
app.post("/api/games/validate", checkLoggedIn, async (req, res) => {
  try {
    const { segments } = req.body;

    // Recuperiamo partenza e arrivo DALLA SESSIONE, non dal body!
    const assignedRoute = req.session.assignedRoute;

    if (!assignedRoute) {
      return res.status(400).json({ 
        isValid: false, 
        error: "Nessun percorso assegnato trovato in sessione. Inizia prima una partita.",
        finalScore: 0 
      });
    }

    const { startId, endId } = assignedRoute;

    if (!globalGraph) {
      const network = await getNetwork();
      globalGraph = buildDoubleLinkedList(network);
    }

    const validationResult = validateSubmittedRoute(globalGraph, segments, startId, endId);

    // Resettiamo la partita in sessione, sia in caso di vittoria che di sconfitta
    req.session.assignedRoute = null;

    if (!validationResult.isValid) {
      // Se il percorso è invalido, il giocatore perde le sue 20 monete e il gioco finisce con score = 0
      // Dobbiamo anche salvare il punteggio di 0 nel database
      await saveGame(req.user.username, 0);

      return res.status(400).json({ 
        isValid: false, 
        error: validationResult.error,
        finalScore: 0 
      });
    }

    // Se la route è valida, prendiamo gli eventi dal DB
    const allEvents = await getEvents();
    
    // Generiamo gli eventi casuali per ogni segmento (basato sul peso)
    const segmentEvents = generateRandomEvents(allEvents, segments.length);

    let currentScore = 20; // Si parte con 20 monete
    const executionSteps = [];

    for (let i = 0; i < segments.length; i++) {
      const ev = segmentEvents[i];
      currentScore += ev.bonus;
      
      // Assicuriamoci che il punteggio finale non sia negativo per via degli eventi sfortunati
      if (currentScore < 0) currentScore = 0;

      // Recuperiamo i nomi delle stazioni per rendere il messaggio più ricco
      const startNode = globalGraph.get(segments[i].startId);
      const endNode = globalGraph.get(segments[i].endId);

      executionSteps.push({
        step: i + 1,
        segment: `${startNode.name} -> ${endNode.name}`,
        message: ev.event_name, // Fix: il DB restituisce 'event_name', non 'name'
        scoreChange: ev.bonus
      });
    }

    // Salviamo il punteggio finale nel database per la classifica
    await saveGame(req.user.username, currentScore);

    return res.json({
      isValid: true,
      events: executionSteps,
      finalScore: currentScore
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error validating route and executing game" });
  }
})

//GET api/events

app.get("/api/events", checkLoggedIn, async (req, res) => {
  try {
    const events = await getEvents();
    return res.json(events);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error getting events" });
  }
})


//GET api/scores 
app.get("/api/games", checkLoggedIn, async (req, res) => {
  try {
    const games = await getBestScores();
    return res.json(games);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error getting best scores data" });
  }
})




// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
