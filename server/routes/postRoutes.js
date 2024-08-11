import express from 'express';
import { createPost, likePost, addComment, getPostDetails } from '../controllers/postController.js';
import { authMiddleware, isAuthenticated } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

// Create a new post
router.post('/create', authMiddleware, isAuthenticated ,upload.any(), createPost);

// Like a post
router.post('/:postId/like', isAuthenticated, likePost);

// Add a comment to a post
router.post('/:postId/comment', isAuthenticated, addComment);

// Get post details including comments and likes
router.get('/:postId', getPostDetails);

export default router;
