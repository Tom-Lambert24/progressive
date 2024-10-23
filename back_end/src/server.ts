import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import './config/passportConfig';
import dotenv from 'dotenv';

dotenv.config()

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'no-secret',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express with TypeScript!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});