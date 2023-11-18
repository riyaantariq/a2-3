const jwt = require('jsonwebtoken');

require('dotenv').config();

const secret = process.env.JWT_SECRET;
process.env.JWT_SECRET = 'riyaan123';

console.log('JWT_SECRET:', secret);


const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');



  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, secret);
    console.log('Decoded Token:', decodedToken);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error('Error during authentication:', error);   

    res.status(401).json({ error: 'Unnauthorized baby' });
  }
  
};


  

module.exports = authMiddleware;
