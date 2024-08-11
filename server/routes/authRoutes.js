import express from 'express';  
import { registerUser, loginUser } from '../controllers/authController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/', authMiddleware, (req, res) => {
    res.send('Welcome to protected route');
});

export default router;