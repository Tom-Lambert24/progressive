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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForUsername = exports.getWorkoutIdByExerciseId = exports.deleteWorkoutById = exports.addDifficultyByExerciseId = exports.getWorkoutList = exports.getExerciseId = exports.removeExercise = exports.uploadExercise = exports.getWorkoutDataById = exports.getWorkoutById = exports.uploadWorkoutName = exports.getUserById = exports.getUserByUsername = void 0;
const { getClient } = require("./config/get-client");
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    const response = yield client.query("SELECT * FROM users WHERE username = $1", [username]);
    client.end();
    return response.rows[0] || null; // Return the user object or null if not found
});
exports.getUserByUsername = getUserByUsername;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    const response = yield client.query("SELECT * FROM users WHERE id = $1", [
        id,
    ]);
    client.end();
    return response.rows[0] || null; // Return the user object or null if not found
});
exports.getUserById = getUserById;
const uploadWorkoutName = (id, workoutName) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    const response = yield client.query("INSERT INTO workouts (users_id, workout_name) VALUES ($1, $2) RETURNING id", [id, workoutName]);
    client.end();
    return response.rows[0];
});
exports.uploadWorkoutName = uploadWorkoutName;
const getWorkoutById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    const response = yield client.query("SELECT * FROM workouts WHERE id = $1", [
        id,
    ]);
    client.end();
    return response.rows[0];
});
exports.getWorkoutById = getWorkoutById;
const getWorkoutDataById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    const response = yield client.query("SELECT * FROM exercises WHERE workouts_id = $1 ORDER BY id ASC", [id]);
    client.end();
    return response.rows;
});
exports.getWorkoutDataById = getWorkoutDataById;
const uploadExercise = (workoutId, workoutData) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    const response = yield client.query("INSERT INTO exercises (workouts_id, workout_data) VALUES ($1, $2)", [workoutId, workoutData]);
    client.end();
});
exports.uploadExercise = uploadExercise;
const removeExercise = (exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    yield client.query("DELETE FROM exercises WHERE id = $1", [exerciseId]);
    client.end();
});
exports.removeExercise = removeExercise;
const getExerciseId = (workoutId, index) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    const response = yield client.query("SELECT * FROM exercises WHERE workouts_id = $1", [workoutId]);
    client.end();
    return response.rows[index].id;
});
exports.getExerciseId = getExerciseId;
const getWorkoutList = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    const response = yield client.query("SELECT id, workout_name FROM workouts WHERE users_id = $1", [id]);
    client.end();
    return response.rows;
});
exports.getWorkoutList = getWorkoutList;
const addDifficultyByExerciseId = (id, difficulty, workoutData) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    yield client.query("UPDATE exercises SET workout_data = $1, last_difficulty = $2 WHERE id = $3", [workoutData, difficulty, id]);
    client.end();
});
exports.addDifficultyByExerciseId = addDifficultyByExerciseId;
const deleteWorkoutById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    yield client.query("DELETE FROM workouts WHERE id = $1", [id]);
    client.end();
});
exports.deleteWorkoutById = deleteWorkoutById;
const getWorkoutIdByExerciseId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    const response = yield client.query("SELECT workouts_id FROM exercises WHERE id = $1", [id]);
    return response.rows[0];
});
exports.getWorkoutIdByExerciseId = getWorkoutIdByExerciseId;
const checkForUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    const existingUser = yield client.query("SELECT username FROM users WHERE username = $1", [username]);
    if (existingUser.rowCount > 0) {
        return true;
    }
    else {
        return false;
    }
    client.end();
});
exports.checkForUsername = checkForUsername;
