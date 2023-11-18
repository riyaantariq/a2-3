const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('./authmid');
require('dotenv').config();

const secret = process.env.JWT_SECRET;


router.post('/register', async (req, res) => {
    console.log('Received request body:', req.body);

    try {
      const { username, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      if (!hashedPassword) {
        return res.status(500).json({ error: 'Error hashing the password' });
      }
  
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during user registration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id, email: user.email }, secret, { expiresIn: '1h' });
      console.log('User logged in successfully:', { email: req.body.email });
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error during user login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

module.exports = router;
