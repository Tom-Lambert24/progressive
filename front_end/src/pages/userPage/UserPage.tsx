import React, { useEffect, useState } from "react";
import "./userPage.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../helperFunctions";

const UserPage: React.FC = () => {
  const [id, setId] = useState();
  const [username, setUsername] = useState("");
  const [workouts, setWorkouts] = useState();
  const [workoutNames, setWorkoutNames] = useState<any[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<any[]>([]);

  const displayName = username ? username.split("@")[0] : "";

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_URL + "/loggedin",
          {
            credentials: "include", // Include credentials for same-origin requests
          }
        );

        if (response.ok) {
          const data = await response.json();
          // If logged in, redirect to user's page
          setUsername(data.username);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking logged in status:", error);
      }
    };

    checkLoggedIn();
  }, []);

  const goToCreateWorkout = () => {
    navigate(`/createWorkout`);
  };

  const logoutApp = () => {
    logout();
    navigate("/login");
  };

  const getWorkouts = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + "/getWorkoutList",
        {
          credentials: "include", // Include credentials for same-origin requests
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts);
      }
    } catch (error) {
      console.error("Error getting workout data:", error);
    }
  };

  useEffect(() => {
    getWorkouts();
  }, []);

  useEffect(() => {
    if (workouts) {
      setWorkoutNames(workouts[0]);
      setWorkoutExercises(workouts[1]);
    }
  }, [workouts]);

  useEffect(() => {}, [workoutNames]);

  const editWorkout = (workoutIndex: number) => {
    navigate("/editWorkout/" + workoutNames[workoutIndex].id);
  };

  const deleteWorkout = async (workoutIndex: number) => {
    const workoutId = workoutNames[workoutIndex].id;

    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + "/deleteWorkout",
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workoutId: workoutId,
          }),
        }
      );

      if (response.ok) {
        getWorkouts();
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const startExercise = async (workoutIndex: number) => {
    const workoutId = workoutNames[workoutIndex].id;

    navigate("/workout/" + workoutId);
  };

  return (
    <>
      <header>
        <h1>progressive</h1>
        <button id="logout" onClick={logoutApp}>
          Logout
        </button>
      </header>
      <body>
        <h2>{displayName}</h2>
        <div id="exercises">
          {workoutNames !== undefined &&
            workoutNames.map((workout, index) => {
              return (
                <div id="workout-block">
                  <h4 id="workout-title">{workout.workout_name}</h4>
                  <div key={index} id="exerciseList">
                    {workoutExercises[index] !== undefined &&
                      workoutExercises[index].map((exercise: any) => (
                        <div className="exercise">
                          {/* Check the exercise type */}
                          {exercise.workout_data.workoutData[1] ===
                            "Weighted Reps" && (
                            <>
                              {/* Format for Weighted Reps */}
                              <div className="exercise-row-userpage">
                                <strong id="exercise-name-userpage">
                                  {exercise.workout_data.workoutData[0]}:
                                </strong>
                                <div id="exercise-details-userpage">
                                  <strong>
                                    {exercise.workout_data.workoutData[2]}{" "}
                                    {exercise.workout_data.workoutData[3]}
                                  </strong>{" "}
                                  for{" "}
                                  <strong>
                                    {exercise.workout_data.workoutData[4]} reps
                                  </strong>
                                  <br />
                                  for <strong>{exercise.workout_data.workoutData[5]} sets</strong>
                                </div>
                              </div>
                            </>
                          )}
                          {exercise.workout_data.workoutData[1] ===
                            "Bodyweight Reps" && (
                            <>
                              {/* Format for Bodyweight Reps */}
                              <div className="exercise-row-userpage">
                                <strong id="exercise-name-userpage">
                                  {exercise.workout_data.workoutData[0]}:
                                </strong>
                                <div id="exercise-details-userpage">
                                  <strong>
                                    {exercise.workout_data.workoutData[2]} reps
                                  </strong>
                                  &nbsp; for <strong>{exercise.workout_data.workoutData[3]} sets</strong>
                                </div>
                              </div>
                            </>
                          )}
                          {exercise.workout_data.workoutData[1] ===
                            "Timed Exercise" && (
                            <>
                              {/* Format for Timed Exercise */}
                              <div className="exercise-row-userpage">
                                <strong id="exercise-name-userpage">
                                  {exercise.workout_data.workoutData[0]}:
                                </strong>
                                <div id="exercise-details-userpage">
                                  <strong>
                                    {exercise.workout_data.workoutData[2]}{" "}
                                    seconds
                                  </strong>
                                  <br />
                                  for <strong>{exercise.workout_data.workoutData[3]} sets</strong>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                  <div id="button-row">
                    <button id="start" onClick={() => startExercise(index)}>
                      Start
                    </button>
                    <button id="edit" onClick={() => editWorkout(index)}>
                      Edit
                    </button>
                    <button id="delete" onClick={() => deleteWorkout(index)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="center-button">
          <button onClick={goToCreateWorkout}>+</button>
        </div>
      </body>
    </>
  );
};

export default UserPage;
