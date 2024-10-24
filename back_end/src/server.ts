import express, { Application, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passportConfig";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
const { getClient } = require("./config/get-client.tsx");

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "no-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Simple route
app.get("/", (req: Request, res: Response) => {
  res.send();
});

app.post("/register", async (req: Request, res: Response) => {

  const username = req.body.username;
  const password = req.body.username;

  const hashPassword = await bcrypt.hash(password, 10);

  //send to database
  try {
    const client = await getClient();

    await client.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hashPassword]
    );

    client.end();

    res.send('User registered')
  } catch (e) {
    console.log(e);
    res.send('error while registering')
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
