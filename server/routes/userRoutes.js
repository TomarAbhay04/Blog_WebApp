import express from 'express';
import { searchUsers, addFriend, getFriends } from '../controllers/userController.js';

const router = express.Router();

router.get('/search', searchUsers);
router.post('/add-friend', addFriend);
router.get('/friends', getFriends); // New route to get friends

export default router;
