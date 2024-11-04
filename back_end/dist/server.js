"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./config/passportConfig");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const databaseFunctions_1 = require("./databaseFunctions");
const { getClient } = require("./config/get-client");
const { initialize } = require("./config/passportConfig");
const path = require("path");
const app = (0, express_1.default)();
dotenv_1.default.config();
// Middleware
const corsOptions = {
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    origin: "http://localhost:3000",
};
app.use(express_1.default.static(path.join(__dirname, '../../front_end/build')));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Initialize Passport
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Helps mitigate XSS
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
initialize(passport_1.default, databaseFunctions_1.getUserByUsername, databaseFunctions_1.getUserById);
// Simple route
app.get("/", (req, res) => {
    res.send();
});
const validateEmailFormat = (username) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
const validatePassword = (password) => password.length >= 8; // Minimum 8 characters for password strength
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (yield (0, databaseFunctions_1.checkForUsername)(username)) {
        res.status(400).json({ error: "Email is already registered." });
        return;
    }
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    //send to database
    try {
        const client = yield getClient();
        yield client.query("INSERT INTO users (username, password_hash) VALUES ($1, $2)", [username, hashPassword]);
        client.end();
        res.send("User registered");
    }
    catch (e) {
        res.send("error while registering");
    }
}));
app.post("/login", (req, res, next) => {
    passport_1.default.authenticate("local", (err, user, info) => {
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
    })(req, res, next);
});
app.get("/loggedin", isAuthenticated, (req, res) => {
    const user = req.user;
    res.json({ id: user.id, username: user.username });
});
app.get("/notLoggedIn", isNotAuthenticated, (req, res) => {
    res.json();
});
app.post("/createWorkoutName", isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    var workout;
    const userDetails = yield (0, databaseFunctions_1.getUserByUsername)(user.username);
    if (userDetails) {
        workout = yield (0, databaseFunctions_1.uploadWorkoutName)(userDetails.id, req.body.workoutName);
    }
    else {
        res.status(500).json("Error");
    }
    if (workout) {
        res.json({ id: workout.id });
    }
}));
app.post("/addExercise", isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const workoutId = req.body.workoutId;
        // Retrieve the workout data and verify ownership
        const workout = yield (0, databaseFunctions_1.getWorkoutById)(workoutId);
        if (!workout) {
            res.status(404).json({ message: "Workout not found" });
            return;
        }
        if (workout.users_id !== user.id) {
            res.status(403).json({ message: "Access forbidden" });
            return;
        }
        const workoutData = req.body.workoutData;
        const workoutDataJSON = JSON.stringify({ workoutData });
        yield (0, databaseFunctions_1.uploadExercise)(workoutId, workoutDataJSON);
        // If all conditions pass, send success response
        res.json({ message: "Exercise added" });
    }
    catch (error) {
        console.error("Error adding exercise:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Server error" });
        }
    }
}));
app.post("/removeExercise", isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const workoutId = req.body.workoutId;
        const index = req.body.index;
        // Retrieve the workout data and verify ownership
        const workout = yield (0, databaseFunctions_1.getWorkoutById)(workoutId);
        if (!workout) {
            res.status(404).json({ message: "Workout not found" });
            return;
        }
        if (workout.users_id !== user.id) {
            res.status(403).json({ message: "Access forbidden" });
            return;
        }
        const exerciseId = yield (0, databaseFunctions_1.getExerciseId)(workoutId, index);
        yield (0, databaseFunctions_1.removeExercise)(exerciseId);
        // If all conditions pass, send success response
        res.json({ message: "Exercise removed" });
    }
    catch (error) {
        console.error("Error removing exercise:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Server error" });
        }
    }
}));
app.get("/getWorkout", isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workoutIdString = req.query.workoutId;
    const workoutId = workoutIdString ? parseInt(workoutIdString, 10) : NaN;
    if (isNaN(workoutId)) {
        res.status(400).json({ message: "Invalid workout ID." });
        return;
    }
    try {
        const workout = yield (0, databaseFunctions_1.getWorkoutById)(workoutId);
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
    }
    catch (error) {
        console.error("Error fetching workout:", error);
        res.status(500).json({ message: "Server error." });
    }
}));
app.get("/getWorkoutData", isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workoutIdString = req.query.workoutId;
    const workoutId = workoutIdString ? parseInt(workoutIdString, 10) : NaN;
    const workoutData = yield (0, databaseFunctions_1.getWorkoutDataById)(workoutId);
    if (workoutData[0]) {
        const workout = yield (0, databaseFunctions_1.getWorkoutById)(workoutData[0].workouts_id);
        if (req.user) {
            if (workout.users_id !== req.user.id) {
                res.status(403).json({ message: "Access forbidden." });
                return;
            }
        }
        res.json({ workoutData: workoutData });
    }
    else {
        res.json({ workoutData: null });
    }
}));
app.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err)
            return res.status(500).send({ message: "Error logging out." });
        req.session.destroy(() => {
            res.clearCookie("connect.sid"); // Adjust the cookie name if needed
            res.status(200).send({ message: "Logged out successfully" });
        });
    });
});
app.post("/deleteWorkout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const workoutId = req.body.workoutId;
    const workout = yield (0, databaseFunctions_1.getWorkoutById)(workoutId);
    if (workout.users_id !== user.id) {
        res.status(403).json({ message: "Access forbidden" });
        return;
    }
    try {
        yield (0, databaseFunctions_1.deleteWorkoutById)(workoutId);
        res.status(200).json();
    }
    catch (e) {
        res.status(500).json({ message: "server error" });
    }
}));
app.get("/getWorkoutList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
    }
    else {
        const user = req.user;
        const id = parseInt(user.id);
        const allData = [];
        const workoutList = yield (0, databaseFunctions_1.getWorkoutList)(id);
        allData.push(workoutList);
        const workoutDataList = [];
        for (let i = 0; i < workoutList.length; i++) {
            const workoutId = workoutList[i].id;
            const workoutData = yield (0, databaseFunctions_1.getWorkoutDataById)(workoutId);
            if (workoutData[0] !== "") {
                workoutDataList.push(workoutData);
            }
            else {
                workoutDataList.push(null);
            }
        }
        allData.push(workoutDataList);
        res.json({ workouts: allData });
    }
}));
app.post("/uploadExerciseDifficulty", isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const id = req.body.exerciseId;
    const difficulty = req.body.difficulty;
    const workoutData = req.body.workoutData;
    const workoutDataJSON = JSON.stringify({ workoutData });
    const workout = yield (0, databaseFunctions_1.getWorkoutIdByExerciseId)(id);
    const fullWorkoutData = yield (0, databaseFunctions_1.getWorkoutById)(workout.workouts_id);
    if (fullWorkoutData.users_id !== user.id) {
        res.status(403).json({ message: "Access forbidden" });
        return;
    }
    yield (0, databaseFunctions_1.addDifficultyByExerciseId)(id, difficulty, workoutDataJSON);
    res.status(200).json();
}));
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.status(401).send("Unauthorized");
    }
}
function isNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.status(401).send("Unauthorized");
        return;
    }
    next();
}
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../front_end/build', 'index.html'));
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
