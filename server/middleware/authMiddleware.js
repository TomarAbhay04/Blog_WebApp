import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Assumes .env is in the root directory

const authMiddleware = (req, res, next) => {
  // Log the JWT_SECRET value (ensure this is not exposed in production)
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  const token = req.headers['authorization']?.split(' ')[1]; // For Bearer token
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);

    req.user = decoded.user; // Ensure decoded.user is part of your token payload
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

export { authMiddleware, isAuthenticated };