
const express = require('express');
const router = express.Router();
const authenticateUser = require('./authmid');
const BlogPost = require('../models/BlogPost'); 
const User = require('../models/User');

router.use(authenticateUser);



// Create Blog Post
router.post('/posts', authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Create a new post
    const newPost = new BlogPost({
      title,
      content,
      author: req.user.userId,
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Read Blog Posts with pagination and filtering options
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy, sortOrder } = req.query;
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Retrieve paginated and sorted blog posts
    const posts = await Post.find({})
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/posts/:postId', async (req, res) => {
  try {
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

// Update Blog Post
router.put('/posts/:postId', authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findById(req.params.postId);
    if (!post || post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Post.findByIdAndUpdate(req.params.postId, { title, content });

    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete Blog Post
router.delete('/posts/:postId', authenticateUser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post || post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Rate Blog Post
router.post('/posts/:postId/rate', authenticateUser, async (req, res) => {
  try {
    const { value } = req.body;

    const post = await Post.findById(req.params.postId);
    if (post.ratings.some((rating) => rating.user.toString() === req.user.userId)) {
      return res.status(400).json({ message: 'User already rated this post' });
    }

    post.ratings.push({ user: req.user.userId, value });
    await post.save();

    res.status(200).json({ message: 'Post rated successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Comment on Blog Post
router.post('/posts/:postId/comments', authenticateUser, async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.postId);
    post.comments.push({ user: req.user.userId, text });
    await post.save();

    res.status(200).json({ message: 'Comment added successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Search Blog Posts
router.get('/api/search', async (req, res) => {
  try {
    const { query, category, author, sortBy, sortOrder } = req.query;

    // Build the search criteria
    const searchCriteria = {};
    if (query) {
      searchCriteria.$or = [
        { title: { $regex: new RegExp(query, 'i') } },
        { content: { $regex: new RegExp(query, 'i') } },
      ];
    }
    if (category) {
      searchCriteria.category = category;
    }
    if (author) {
      const authorUser = await User.findOne({ username: author });
      if (authorUser) {
        searchCriteria.author = authorUser._id;
      } else {
        return res.status(404).json({ message: 'Author not found' });
      }
    }

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Retrieve search results
    const searchResults = await Post.find(searchCriteria)
      .sort(sortOptions)
      .limit(10);  

    res.status(200).json({ results: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = router;
