import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passportConfig";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { getUserByUsername, getUserById } from "./databaseFunctions";
const { getClient } = require("./config/get-client");
const { initialize } = require("./config/passportConfig");

const app: Application = express();
dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Initialize Passport

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

initialize(passport, getUserByUsername);

type User = {
  id: string;
  username: string;
  password_hash: string;
};

// Simple route
app.get("/", (req: Request, res: Response) => {
  res.send();
});

app.post("/register", async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  const hashPassword = await bcrypt.hash(password, 10);

  //send to database
  console.log('this ran!')
  try {
    const client = await getClient();

    await client.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hashPassword]
    );

    client.end();

    res.send("User registered");
  } catch (e) {
    console.log(e);
    res.send("error while registering");
  }
});

  app.post("/login", (req, res, next) => {
    passport.authenticate(
      "local",
      (err: Error | null, user: User | false, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: "Invalid login." });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.json({ username: user.username, id: user.id });
        });
      }
    )(req, res, next);
  });

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function isNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }

  next();
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
