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
  removeExercise,
  getExerciseId,
  getWorkoutList,
  deleteWorkoutById,
  addDifficultyByExerciseId,
  getWorkoutIdByExerciseId,
  checkForUsername,
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

const validateEmailFormat = (username: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
const validatePassword = (password: string) => password.length >= 8; // Minimum 8 characters for password strength

app.post("/register", async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validate username as email and password
  if (!username || !validateEmailFormat(username)) {
    res.status(400).json({ error: "Invalid email format." });
    return;
  }
  if (!password || !validatePassword(password)) {
    res
      .status(400)
      .json({ error: "Invalid password. Must be at least 8 characters long." });
    return;
  }

  if (await checkForUsername(username)) {
    res.status(400).json({ error: "Email is already registered." });
    return;
  }
  const hashPassword = await bcrypt.hash(password, 10);

  //send to database
  try {
    const client = await getClient();

    await client.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hashPassword]
    );

    client.end();

    res.send("User registered");
  } catch (e) {
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
  const user = req.user as User;
  res.json({ id: user.id, username: user.username });
});

app.get("/notLoggedIn", isNotAuthenticated, (req: Request, res: Response) => {
  res.json();
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

app.post(
  "/removeExercise",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const workoutId: number = req.body.workoutId;
      const index: number = req.body.index;

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

      const exerciseId = await getExerciseId(workoutId, index);

      await removeExercise(exerciseId);

      // If all conditions pass, send success response
      res.json({ message: "Exercise removed" });
    } catch (error) {
      console.error("Error removing exercise:", error);
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

    if (workoutData[0]) {
      const workout = await getWorkoutById(workoutData[0].workouts_id);
      if (req.user) {
        if (workout.users_id !== req.user.id) {
          res.status(403).json({ message: "Access forbidden." });
          return;
        }
      }
      res.json({ workoutData: workoutData });
    } else {
      res.json({ workoutData: null });
    }
  }
);

app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send({ message: "Error logging out." });
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // Adjust the cookie name if needed
      res.status(200).send({ message: "Logged out successfully" });
    });
  });
});

app.post("/deleteWorkout", async (req, res) => {
  const user = req.user as User;
  const workoutId = req.body.workoutId;

  const workout = await getWorkoutById(workoutId);

  if (workout.users_id !== user.id) {
    res.status(403).json({ message: "Access forbidden" });
    return;
  }

  try {
    await deleteWorkoutById(workoutId);

    res.status(200).json();
  } catch (e) {
    res.status(500).json({ message: "server error" });
  }
});

app.get("/getWorkoutList", async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    const user = req.user as User;
    const id = parseInt(user.id);
    const allData = [];

    const workoutList = await getWorkoutList(id);
    allData.push(workoutList);

    const workoutDataList = [];
    for (let i = 0; i < workoutList.length; i++) {
      const workoutId = workoutList[i].id;
      const workoutData = await getWorkoutDataById(workoutId);
      if (workoutData[0] !== "") {
        workoutDataList.push(workoutData);
      } else {
        workoutDataList.push(null);
      }
    }

    allData.push(workoutDataList);

    res.json({ workouts: allData });
  }
});

app.post(
  "/uploadExerciseDifficulty",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const user = req.user as User;

    const id = req.body.exerciseId;

    const difficulty = req.body.difficulty;

    const workoutData: any[] = req.body.workoutData;
    const workoutDataJSON: string = JSON.stringify({ workoutData });

    const workout = await getWorkoutIdByExerciseId(id);

    const fullWorkoutData = await getWorkoutById(workout.workouts_id);

    if (fullWorkoutData.users_id !== user.id) {
      res.status(403).json({ message: "Access forbidden" });
      return;
    }

    await addDifficultyByExerciseId(id, difficulty, workoutDataJSON);

    res.status(200).json();
  }
);

function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

function isNotAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    res.status(401).send("Unauthorized");
    return;
  }

  next();
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
