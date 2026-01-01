import jwt from 'jsonwebtoken';

/* ==============================
 🔎 Extract Token Helper
 ============================== */
const extractToken = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

/* ==============================
 🛡️ Main Auth Middleware
 ============================== */
export const auth = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, isAdmin }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

/* ==============================
 🟡 Optional Auth Middleware
 ============================== */
export const optionalAuth = (req, res, next) => {
  const token = extractToken(req);

  if (!token) return next();

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log('OptionalAuth: Token invalid or expired');
  }

  next();
};

/* ==============================
 🔒 Verify Admin Access
 ============================== */
export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Admins only' });
  }

  next();
};

/* ==============================
 🔒 Verify Super Admin Access
 ============================== */
export const verifySuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Super Admin access only' });
  }

  next();
};
/* ==============================
 🔑 Legacy alias for backward compatibility
 ============================== */
export const verifyToken = auth;
export const protect = auth; // Add this line at the bottom
