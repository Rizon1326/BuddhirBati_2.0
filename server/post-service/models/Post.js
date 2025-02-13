//backend/post-service/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled',
    },
    content: {
        type: String,
        // required: true,
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    author_email: {
        type: String, // Include senderEmail in the Post model
        required: true,
    },
    file_url: {
        type: String,
    },
    file_name: {
        type: String,
    },
    file_type: {
        type: String,
    },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
