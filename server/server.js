import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
// import authMiddleware from './middleware/authMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import postRoutes from './routes/postRoutes.js';
import './config/passport.js'

dotenv.config();
// tomarabhay@gmail.com
//  Tomarabhay@123
const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true
}));app.use(express.json({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
  }));

  // Initialize Passport and use passport session
app.use(passport.initialize());
app.use(passport.session());

  
// app.use('/api/auth', authMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  