const express = require('express');
const router = express.Router();
const authenticateUser = require('./authmid');
const User = require('../models/User');

router.use(authenticateUser);

// Admin Operations - View All Users
router.get('/users', authenticateUser, async (req, res) => {
  try {
    // Check if the authenticated user is an admin
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Fetch all users
    const allUsers = await User.find().select('-password');
    
    res.status(200).json({ users: allUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Admin Operations - Block/Disable User
router.put('/users/:userId/block', authenticateUser, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.userId);
    if (adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Block/Disable the user
    await User.findByIdAndUpdate(req.params.userId, { $set: { blocked: true } });

    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Admin Operations - List All Blog Posts
router.get('/posts', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Fetch all blog posts
    const allPosts = await Post.find().select('title author creationDate averageRating');

    res.status(200).json({ posts: allPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/posts/:postId', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Fetch the particular blog post
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Admin Operations - Disable Blog Post
router.put('/posts/:postId/disable', authenticateUser, async (req, res) => {
  try {
    // Check if the authenticated user is an admin
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Disable the blog post
    await Post.findByIdAndUpdate(req.params.postId, { $set: { disabled: true } });

    res.status(200).json({ message: 'Blog post disabled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
