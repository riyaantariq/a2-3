require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 475;

app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/public')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017',  {
  
    serverSelectionTimeoutMS: 5000,   
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
  
  db.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });


try {
  const authRoutes = require('./routes/authRoutes');
  const blogRoutes = require('./routes/blogRoutes');
  const userRoutes = require('./routes/userRoutes');
  const adminRoutes = require('./routes/adminRoutes');



  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, ''));
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/blog', blogRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/admin', adminRoutes);

 
  app.listen(PORT, () => {
    console.log(`slayyyyyyyyy`);
  });
} catch (error) {
  console.error('Error loading route files:', error);
}
