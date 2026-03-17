import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import passport from '../config/passport.js';
import { protect } from '../middleware/protect.js';

const googleClient = new OAuth2Client();

const router = Router();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// ── Helpers ──────────────────────────────────────────────────────────────────

function issueJwt(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function setTokenCookie(res, token) {
  // When the backend is behind HTTPS (e.g. ngrok) the frontend may be on a
  // different origin (localhost:5173). SameSite=None; Secure is required so
  // the browser sends the cookie on cross-origin credentialed fetch requests.
  const isHttps = (process.env.BACKEND_URL || '').startsWith('https://');
  res.cookie('token', token, {
    httpOnly: true,
    secure: isHttps || process.env.NODE_ENV === 'production',
    sameSite: isHttps ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE,
  });
}

// ── Routes ────────────────────────────────────────────────────────────────────

// ── Client-side token exchange (used by @react-oauth/google on the frontend) ──
// Receives the Google ID token credential, verifies it, issues JWT cookie.
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'credential is required' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = {
      id: payload.sub,
      displayName: payload.name,
      email: payload.email,
      photo: payload.picture ?? null,
    };

    const token = issueJwt(user);
    setTokenCookie(res, token);
    // Also return the raw token so mobile clients can store it in SecureStore.
    // Web clients use the httpOnly cookie and ignore this field.
    res.json({ user, token });
  } catch {
    res.status(401).json({ error: 'Invalid Google credential' });
  }
});

// ── Server-side redirect flow (kept for non-SPA / mobile deep-link use) ──────

// Step 1a – redirect web browser to Google's consent screen
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 1b – mobile: pass state='mobile' through the OAuth flow so the callback
// knows to redirect to the deep link instead of the web CLIENT_URL.
// Using state is more reliable than a session flag because the session cookie
// can be dropped by cross-site redirects (Google → backend) in some browsers.
router.get(
  '/google/mobile',
  passport.authenticate('google', { scope: ['profile', 'email'], state: 'mobile' })
);

// Step 2 – Google redirects back here with an authorization code
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failed',
    // Keep the session for the OAuth state check; JWT handles auth from here.
  }),
  (req, res) => {
    const token = issueJwt(req.user);
    const isMobile = req.query.state === 'mobile';

    // Destroy the passport session – the JWT cookie / deep link takes over.
    req.logout(() => {});

    if (isMobile) {
      // Redirect back into the mobile app via deep link; Expo intercepts it.
      return res.redirect(`pillpal://auth?token=${token}`);
    }

    setTokenCookie(res, token);
    res.redirect(CLIENT_URL);
  }
);

// Return the currently logged-in user (reads JWT cookie via protect middleware)
router.get('/me', protect, (req, res) => {
  // Strip JWT metadata fields before returning
  const { iat, exp, ...user } = req.user;
  res.json({ user });
});

// Clear the JWT cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
});

// Fallback when Google auth fails
router.get('/failed', (_req, res) => {
  res.status(401).json({ error: 'Google authentication failed' });
});

export default router;
