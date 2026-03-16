import jwt from 'jsonwebtoken';

/**
 * Blocks requests that don't carry a valid JWT in the `token` httpOnly cookie.
 * Attach this to any route that requires authentication.
 */
export function protect(req, res, next) {
  // Cookie-based (web browser) — set by POST /auth/google as httpOnly cookie
  let token = req.cookies?.token;

  // Bearer token (mobile) — sent in Authorization header from expo-secure-store
  if (!token) {
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) token = auth.slice(7);
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
