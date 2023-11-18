const express = require('express');
const router = express.Router();
const authenticateUser = require('./authmid');
const User = require('../models/User');


router.use(authenticateUser);


router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { username } = req.body;

    await User.findByIdAndUpdate(req.user.userId, { username });

    const updatedUser = await User.findById(req.user.userId).select('-password');

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Follow User
router.post('/api/users/:userId/follow', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const user = await User.findById(req.user.userId);
    if (user.following.includes(userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Follow the user
    user.following.push(userId);
    await user.save();

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Unfollow User
router.post('/api/users/:userId/unfollow', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot unfollow yourself' });
    }

    const user = await User.findById(req.user.userId);
    if (!user.following.includes(userId)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    // Unfollow the user
    user.following = user.following.filter((followedUserId) => followedUserId !== userId);
    await user.save();

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User Feed
router.get('/api/users/feed', authenticateUser, async (req, res) => {
  try {
    // Fetch the list of users the current user is following
    const user = await User.findById(req.user.userId).populate('following', '-password');

    const posts = await Post.find({ author: { $in: user.following } })
      .sort({ creationDate: -1 })
      .limit(10);  

    res.status(200).json({ feed: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = router;
