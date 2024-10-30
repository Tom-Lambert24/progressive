import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passportConfig";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  getUserByUsername,
  getUserById,
  uploadWorkoutName,
  getWorkoutById,
  uploadExercise,
  getWorkoutDataById,
} from "./databaseFunctions";
const { getClient } = require("./config/get-client");
const { initialize } = require("./config/passportConfig");

const app: Application = express();
dotenv.config();
// Middleware
const corsOptions = {
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Initialize Passport

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Helps mitigate XSS
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

initialize(passport, getUserByUsername, getUserById);

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
  console.log("this ran!");
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

app.get("/loggedin", isAuthenticated, (req: Request, res: Response) => {
  const user = req.user as User; // Cast req.user to the User type
  res.json({ id: user.id, username: user.username });
});

app.post(
  "/createWorkoutName",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const user = req.user as User;
    var workout;

    const userDetails = await getUserByUsername(user.username);

    if (userDetails) {
      workout = await uploadWorkoutName(userDetails.id, req.body.workoutName);
    } else {
      res.status(500).json("Error");
    }

    if (workout) {
      res.json({ id: workout.id });
    }
  }
);

app.post(
  "/addExercise",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const workoutId: number = req.body.workoutId;

      // Retrieve the workout data and verify ownership
      const workout = await getWorkoutById(workoutId);
      if (!workout) {
        res.status(404).json({ message: "Workout not found" });
        return;
      }

      if (workout.users_id !== user.id) {
        res.status(403).json({ message: "Access forbidden" });
        return;
      }

      const workoutData: any[] = req.body.workoutData;
      const workoutDataJSON: string = JSON.stringify({ workoutData });

      console.log('uploading data')
      console.log(workoutId)
      console.log(workoutDataJSON)

      await uploadExercise(workoutId, workoutDataJSON);
      
      // If all conditions pass, send success response
      res.json({ message: "Exercise added" });
    } catch (error) {
      console.error("Error adding exercise:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Server error" });
      }
    }
  }
);


app.get(
  "/getWorkout",
  isAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
    const workoutIdString = req.query.workoutId as string | undefined;
    const workoutId = workoutIdString ? parseInt(workoutIdString, 10) : NaN;

    if (isNaN(workoutId)) {
      res.status(400).json({ message: "Invalid workout ID." });
      return;
    }

    try {
      const workout = await getWorkoutById(workoutId);

      if (!workout) {
        res.status(404).json({ message: "Workout not found." });
        return;
      }

      if (req.user) {
        if (workout.users_id !== req.user.id) {
          res.status(403).json({ message: "Access forbidden." });
          return;
        }
      }

      res.json({ workoutName: workout.workout_name });
    } catch (error) {
      console.error("Error fetching workout:", error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

app.get(
  "/getWorkoutData",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const workoutIdString = req.query.workoutId as string | undefined;

    const workoutId = workoutIdString ? parseInt(workoutIdString, 10) : NaN;

    const workoutData = await getWorkoutDataById(workoutId);

    const workout = await getWorkoutById(workoutData[0].workouts_id)

    if (req.user) {
      if (workout.users_id !== req.user.id) {
        res.status(403).json({ message: "Access forbidden." });
        return;
      }
    }

    res.json({ workoutData: workoutData });
  }
);

function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.isAuthenticated()) {
    return next(); // Proceed to the next middleware/route handler
  }
  res.status(401).send("Unauthorized"); // Return a response if not authenticated
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
