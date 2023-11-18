const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blogPost: {
    type: Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  // Add more fields as needed for comments
  // For example: ratings, replies, etc.
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
