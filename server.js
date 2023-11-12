const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  
    serverSelectionTimeoutMS: 5000,   
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
  
  // Additional check for disconnected event
  db.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });


try {
  const authRoutes = require('./routes/authRoutes');
  const blogRoutes = require('./routes/blogRoutes');
  const userRoutes = require('./routes/userRoutes');
  const adminRoutes = require('./routes/adminRoutes');

  app.get('/', (req, res) => {
    res.send('Hello from the root path!');
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
