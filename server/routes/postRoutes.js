import express from 'express';
import {createPost, likePost, addComment, getPostDetails} from '../controllers/postController.js';
import isAuthenticated from '../middleware/authMiddleware.js';

const router = express.Router();
// Middleware to check if user is authenticated
// const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res.status(401).send('You need to log in first');
//   }
// };

// Create a new post
router.post('/create', isAuthenticated, createPost);

// Like a post
router.post('/:postId/like', isAuthenticated, likePost);

// Add a comment to a post
router.post('/:postId/comment', isAuthenticated, addComment);

// Get post details including comments and likes
router.get('/:postId', getPostDetails);


export default router;
