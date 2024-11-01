import React, { useEffect, useState } from "react";
import "./workout.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../../helperFunctions";

const Workout: React.FC = () => {
  const { workoutId } = useParams();
  const [exercises, setExercises] = useState<any[]>([]);
  const [workoutName, setWorkoutName] = useState();
  const [workoutIndex, setWorkoutIndex] = useState(0);
  let currentWorkoutData: any[];
  const [currentExercise, setCurrentExercise] = useState<any[]>([]);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const displayName = username ? username.split("@")[0] : "";

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

  useEffect(() => {
    const getWorkoutNameById = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_URL +
            "/getWorkout?workoutId=" +
            workoutId,
          {
            credentials: "include", // Include credentials for same-origin requests
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWorkoutName(data.workoutName);
        }
      } catch (error) {
        console.error("Error getting workout:", error);
      }
    };
    getWorkoutNameById();
  }, []);

  useEffect(() => {
    const getWorkoutDataById = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_URL +
            "/getWorkoutData?workoutId=" +
            workoutId,
          {
            credentials: "include", // Include credentials for same-origin requests
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          currentWorkoutData = [];

          if (data.workoutData) {
            for (let i = 0; i < data.workoutData.length; i++) {
              currentWorkoutData.push(
                data.workoutData[i].workout_data.workoutData
              );
            }
          }

          setExercises(currentWorkoutData);
        }
      } catch (error) {
        console.error("Error getting workout data:", error);
      }
    };
    getWorkoutDataById();
  }, []);

  useEffect(() => {
    setCurrentExercise(exercises[workoutIndex]);
  }, [exercises]);

  useEffect(() => {
    setCurrentExercise(exercises[workoutIndex]);
  }, [workoutIndex]);

  const logoutApp = () => {
    logout();
    navigate("/login");
  };

  const goToHome = () => {
    navigate("/user");
  };

  const hardClick = () => {
    setWorkoutIndex((prev) => prev + 1);
  }

  const mediumClick = () => {
    setWorkoutIndex((prev) => prev + 1);
  }

  const easyClick = () => {
    setWorkoutIndex((prev) => prev + 1);
  }

  useEffect(() => {
    console.log(workoutIndex)
  }, [workoutIndex])

  return (
    <>
      <header>
        <a onClick={goToHome}>
          <h1>progressive</h1>
        </a>
        <button id="logout" onClick={logoutApp}>
          Logout
        </button>
      </header>
      <body>
        <h2>{displayName}</h2>
        <div id="current-exercise">
        <h3>{workoutName}</h3>
          <div id="current-exercise-details">
            {currentExercise !== undefined &&
              currentExercise[1] === "Weighted Reps" && (
                <>
                  
                  <h4 id="current-exercise-text">Current Exercise</h4>
                  <div id="workout-details">
                    <strong id="exercise-name">{currentExercise[0]}</strong>
                    <div id="workout-data">
                      <strong>
                        {currentExercise[2]}
                        {currentExercise[3]}
                      </strong>{" "}
                      for&nbsp;
                      <strong>{currentExercise[4]} reps</strong>
                      <br />
                      for <strong>{currentExercise[5]} sets</strong>
                    </div>
                  </div>
                </>
              )}
            {currentExercise !== undefined &&
              currentExercise[1] === "Bodyweight Reps" && (
                <>
                <h4 id="current-exercise-text">Current Exercise</h4>
                  <div id="workout-details">
                    <strong id="exercise-name">{currentExercise[0]}</strong>
                    <div id="workout-data">
                      <strong>{currentExercise[2]} reps</strong> for&nbsp;
                      <strong>{currentExercise[3]} sets</strong>
                    </div>
                  </div>
                </>
              )}
            {currentExercise !== undefined &&
              currentExercise[1] === "Timed Exercise" && (
                <>
                <h4 id="current-exercise-text">Current Exercise</h4>
                  <div id="workout-details">
                    <strong id="exercise-name">{currentExercise[0]}</strong>
                    <div id="workout-data">
                      <strong>{currentExercise[2]} seconds</strong>
                      <br /> for&nbsp;
                      <strong>{currentExercise[3]} sets</strong>
                    </div>
                  </div>
                </>
              )}
          </div>
          <div id="skip-row">
            Machine Taken?
            <button id="skip-exercise">Skip Exercise for Now</button>
          </div>
          <div id="complete-exercise">
            <h5>Was the last rep difficult?</h5>
            <button id="hard" onClick={hardClick}>I could not do it...</button>
            <br />
            <button id="medium" onClick={mediumClick}>It was slow and difficult</button>
            <br />
            <button id="easy" onClick={easyClick}>It moved easily!</button>
          </div>
        </div>
      </body>
    </>
  );
};

export default Workout;
