import express from 'express';
import { createPost, likePost, addComment, getPostDetails, getAllPosts, unlikePost } from '../controllers/postController.js';
import { authMiddleware, isAuthenticated } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

// Create a new post
router.post('/create', authMiddleware, isAuthenticated, upload.any(), createPost);

// Like a post
router.post('/:postId/like', authMiddleware, isAuthenticated, likePost);

// Unlike a post
router.delete('/:postId/like', authMiddleware, isAuthenticated, unlikePost);


// Add a comment to a post
router.post('/:postId/comment', authMiddleware ,isAuthenticated, addComment);

// Get details of a specific post, including comments and likes
router.get('/:postId', getPostDetails);

// (Optional) If you need a route to fetch all posts, you might add:
router.get('/',  getAllPosts);

export default router;