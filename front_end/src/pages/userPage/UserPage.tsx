import React, { useEffect, useState } from "react";
import "./userPage.css";
import { useParams } from "react-router-dom";
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
          setId(data.id);
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
        console.log(data.workouts);
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
      console.log(workouts[0]);
      console.log(workouts[1]);
      setWorkoutNames(workouts[0]);
      setWorkoutExercises(workouts[1]);
    }
  }, [workouts]);

  useEffect(() => {
    console.log(workoutNames);
    console.log(workoutExercises);
  }, [workoutNames]);

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
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                  <div id="button-row">
                    <button id="start">Start</button>
                    <button id="edit">Edit</button>
                    <button id="delete">Delete</button>
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
