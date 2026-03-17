import 'dotenv/config';

// Validate required env vars before any other module reads them
const REQUIRED_ENV = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`\n[backend] Missing required environment variables: ${missing.join(', ')}`);
  console.error('[backend] Copy backend/.env.example → backend/.env and fill in the values.\n');
  process.exit(1);
}

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './config/passport.js';
import authRouter from './routes/auth.js';
import { protect } from './middleware/protect.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ── Allowed origins ───────────────────────────────────────────────────────────
// Web dev server + Expo web (19006) + Expo Go / metro bundler (8081)
const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:19006',
  'http://localhost:8081',
  // Allow the ngrok tunnel origin if set
  ...(process.env.BACKEND_URL?.startsWith('https://') ? [process.env.BACKEND_URL] : []),
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, mobile native fetches)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true, // required so browsers send the httpOnly cookie
  })
);

app.use(express.json());
app.use(cookieParser());

// express-session is only used to preserve OAuth state between the two
// Google redirect legs. JWT handles authentication for all other requests.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000, // 10 minutes – just long enough for OAuth flow
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ── Routes ────────────────────────────────────────────────────────────────────

app.use('/auth', authRouter);

// Health check (public)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ── Protected pill routes ─────────────────────────────────────────────────────
// In-memory store – replace with a database later
let pills = [];

app.get('/api/pills', protect, (_req, res) => {
  res.json(pills);
});

app.post('/api/pills', protect, (req, res) => {
  const pill = { id: Date.now(), ...req.body };
  pills.push(pill);
  res.status(201).json(pill);
});

app.delete('/api/pills/:id', protect, (req, res) => {
  pills = pills.filter((p) => p.id !== Number(req.params.id));
  res.status(204).send();
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PillPal backend listening on 0.0.0.0:${PORT} (accessible from all network interfaces)`);
});
