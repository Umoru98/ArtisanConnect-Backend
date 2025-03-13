import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token) {
    if (!token) return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  })
};

export default authenticateToken;