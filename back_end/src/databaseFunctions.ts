const { getClient } = require("./config/get-client");

// Define a User type if not defined yet
type User = {
  id: number;
  username: string;
  password: string;
};

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const client = await getClient();

  const response = await client.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  return response.rows[0] || null; // Return the user object or null if not found
};

export const getUserById = async (id: string): Promise<User | null> => {
  const client = await getClient();

  const response = await client.query("SELECT * FROM users WHERE id = $1", [
    id,
  ]);
 

  return response.rows[0] || null; // Return the user object or null if not found
};

export const uploadWorkoutName = async (id: number, workoutName: string) => {
  const client = await getClient();
  const response = await client.query(
    "INSERT INTO workouts (users_id, workout_name) VALUES ($1, $2) RETURNING id",
    [id, workoutName]
  );
  
  return response.rows[0];
};

export const getWorkoutById = async (id: number) => {
  const client = await getClient();
  const response = await client.query("SELECT * FROM workouts WHERE id = $1", [
    id,
  ]);
 
  return response.rows[0];
};

export const getWorkoutDataById = async (id: number) => {
  const client = await getClient();
  const response = await client.query(
    "SELECT * FROM exercises WHERE workouts_id = $1 ORDER BY id ASC",
    [id]
  );
 

  return response.rows;
};

export const uploadExercise = async (
  workoutId: number,
  workoutData: string
) => {
  const client = await getClient();
  const response = await client.query(
    "INSERT INTO exercises (workouts_id, workout_data) VALUES ($1, $2)",
    [workoutId, workoutData]
  );
};

export const removeExercise = async (exerciseId: number) => {
  const client = await getClient();
  await client.query("DELETE FROM exercises WHERE id = $1", [exerciseId]);
 
};

export const getExerciseId = async (workoutId: number, index: number) => {
  const client = await getClient();
  const response = await client.query(
    "SELECT * FROM exercises WHERE workouts_id = $1",
    [workoutId]
  );


  return response.rows[index].id;
};

export const getWorkoutList = async (id: number) => {
  const client = await getClient();
  const response = await client.query(
    "SELECT id, workout_name FROM workouts WHERE users_id = $1",
    [id]
  );


  return response.rows;
};

export const addDifficultyByExerciseId = async (
  id: number,
  difficulty: string,
  workoutData: string
) => {
  const client = await getClient();
  await client.query(
    "UPDATE exercises SET workout_data = $1, last_difficulty = $2 WHERE id = $3",
    [workoutData, difficulty, id]
  );

};

export const deleteWorkoutById = async (id: number) => {
  const client = await getClient();
  await client.query("DELETE FROM workouts WHERE id = $1", [id]);

};

export const getWorkoutIdByExerciseId = async (id: number) => {
  const client = await getClient();
  const response = await client.query(
    "SELECT workouts_id FROM exercises WHERE id = $1",
    [id]
  );


  return response.rows[0];
};

export const checkForUsername = async (username: string) => {
  const client = await getClient();
  const existingUser = await client.query(
    "SELECT username FROM users WHERE username = $1",
    [username]
  );


  if (existingUser.rowCount > 0) {
    return true
  } else {
    return false
  }
};
