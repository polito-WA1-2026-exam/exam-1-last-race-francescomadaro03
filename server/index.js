import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUser, getBestScores, getEvents, getNetwork, saveGame } from "./dao.js"


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

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
