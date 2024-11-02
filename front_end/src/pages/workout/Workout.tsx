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
              currentWorkoutData.push(data.workoutData[i]);
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
    if (exercises[workoutIndex]) {
      setCurrentExercise(exercises[workoutIndex].workout_data.workoutData);
    }
  }, [exercises]);

  useEffect(() => {
    if (exercises[workoutIndex]) {
      setCurrentExercise(exercises[workoutIndex].workout_data.workoutData);
    }
  }, [workoutIndex]);

  const logoutApp = () => {
    logout();
    navigate("/login");
  };

  const goToHome = () => {
    navigate("/user");
  };

  const nextExercise = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const difficulty = formData.get("difficulty") as string;

    event.currentTarget.reset();

    const newWorkoutData = exercises[workoutIndex].workout_data.workoutData;

    console.log(newWorkoutData);
    //upload feedback
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + "/uploadExerciseDifficulty",
        {
          method: "POST",
          credentials: "include", // Include credentials for same-origin requests
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exerciseId: exercises[workoutIndex].id,
            difficulty: difficulty[0],
            workoutData: newWorkoutData,
          }),
        }
      );
    } catch (error) {
      console.error("Error uploading feedback data:", error);
    }

    setWorkoutIndex((prev) => prev + 1);

    if (workoutIndex >= exercises.length - 1) {
      navigate(`/workoutReview/${workoutId}`);
    }
  };

  const skipExercise = () => {
    //put exercise back to the end of the list
    const tempExercises = exercises;

    for (let i = exercises.length - 1; i > workoutIndex + 1; i--) {
      tempExercises[i + 1] = tempExercises[i];
    }

    tempExercises[workoutIndex + 2] = tempExercises[workoutIndex];

    setExercises(tempExercises);
    setWorkoutIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (exercises[workoutIndex]) {
      console.log(exercises[workoutIndex]);
    }
  }, [exercises]);

  const progressExercise = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newWeight = formData.get("progress") as string;

    const progressExerciseDiv = document.getElementById("progress-exercise");
    const currentExerciseDiv = document.getElementById("current-exercise");

    if (progressExerciseDiv) {
      progressExerciseDiv.style.display = 'none'
    }

    if (currentExerciseDiv) {
      currentExerciseDiv.style.display = 'block'
    }
  };

  const progressExerciseBodyweight = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const increaseReps = formData.get("increaseReps") as string;
    const progressExerciseDiv = document.getElementById("progress-exercise");
    const currentExerciseDiv = document.getElementById("current-exercise");

    if (progressExerciseDiv) {
      progressExerciseDiv.style.display = 'none'
    }

    if (currentExerciseDiv) {
      currentExerciseDiv.style.display = 'block'
    }

    console.log(increaseReps);
  };

  const progressExerciseTimed = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const increaseReps = formData.get("increaseTime") as string;
    const progressExerciseDiv = document.getElementById("progress-exercise");
    const currentExerciseDiv = document.getElementById("current-exercise");

    if (progressExerciseDiv) {
      progressExerciseDiv.style.display = 'none'
    }

    if (currentExerciseDiv) {
      currentExerciseDiv.style.display = 'block'
    }

    console.log(increaseReps);
  };

  useEffect(() => {
    const progressExerciseDiv = document.getElementById("progress-exercise");
    const currentExerciseDiv = document.getElementById("current-exercise");

    if (exercises[workoutIndex]) {
      if (exercises[workoutIndex].last_difficulty === "h") {
        if (progressExerciseDiv) {
          progressExerciseDiv.style.display = "none";
        }
      }

      if (exercises[workoutIndex].last_difficulty === "m") {
        if (currentExerciseDiv) {
          currentExerciseDiv.style.display = "none";
        }
      }

      if (exercises[workoutIndex].last_difficulty === "e") {
        if (currentExerciseDiv) {
          currentExerciseDiv.style.display = "none";
        }
      }
    }
  }, [exercises]);

  useEffect(() => {
    const progressExerciseDiv = document.getElementById("progress-exercise");
    const currentExerciseDiv = document.getElementById("current-exercise");

    if (exercises[workoutIndex]) {
      if (exercises[workoutIndex].last_difficulty === "h") {
        if (progressExerciseDiv) {
          progressExerciseDiv.style.display = "none";
        }
        if (currentExerciseDiv) {
          currentExerciseDiv.style.display = "block";
        }
      }

      if (exercises[workoutIndex].last_difficulty === "m") {
        if (currentExerciseDiv) {
          currentExerciseDiv.style.display = "none";
        }
        if (progressExerciseDiv) {
          progressExerciseDiv.style.display = "block";
        }
      }

      if (exercises[workoutIndex].last_difficulty === "e") {
        if (currentExerciseDiv) {
          currentExerciseDiv.style.display = "none";
        }
        if (progressExerciseDiv) {
          progressExerciseDiv.style.display = "block";
        }
      }
    }
  }, [workoutIndex]);

  const hideProgression = () => {
    //hide progress and show current workout
    const progressExerciseDiv = document.getElementById("progress-exercise");
    const currentExerciseDiv = document.getElementById("current-exercise");

    if (progressExerciseDiv) {
      progressExerciseDiv.style.display = "none";
    }

    if (currentExerciseDiv) {
      currentExerciseDiv.style.display = "block"
    }
  };

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
        <div id="progress-exercise">
          {exercises[workoutIndex] &&
            exercises[workoutIndex].last_difficulty === "m" && (
              <>
                <h3>{workoutName}</h3>
                <h5>You struggled but completed these sets last time</h5>
                <div id="current-exercise-details">
                  {currentExercise !== undefined &&
                    currentExercise[1] === "Weighted Reps" && (
                      <>
                        <div id="workout-details">
                          <strong id="exercise-name">
                            {currentExercise[0]}
                          </strong>
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
                        <div id="workout-details">
                          <strong id="exercise-name">
                            {currentExercise[0]}
                          </strong>
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
                        <div id="workout-details">
                          <strong id="exercise-name">
                            {currentExercise[0]}
                          </strong>
                          <div id="workout-data">
                            <strong>{currentExercise[2]} seconds</strong>
                            <br /> for&nbsp;
                            <strong>{currentExercise[3]} sets</strong>
                          </div>
                        </div>
                      </>
                    )}
                </div>
                <h5 id="second-h5">Increase difficulty if you wish</h5>
                {currentExercise !== undefined &&
                  currentExercise[1] === "Weighted Reps" && (
                    <form onSubmit={progressExercise}>
                      Pick you're next available weight up or keep it the same
                      <br />
                      <select id="progress" name="progress">
                        {[0, 1, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10].map(
                          (increment) => (
                            <option
                              key={increment}
                              value={parseInt(currentExercise[2]) + increment}
                            >
                              {parseInt(currentExercise[2]) + increment}
                            </option>
                          )
                        )}
                      </select>
                      &nbsp;{currentExercise[3]}
                      <br />
                      <button type="submit" id="update">Update</button>
                    </form>
                  )}
                {currentExercise !== undefined &&
                  currentExercise[1] === "Bodyweight Reps" && (
                    <form onSubmit={progressExerciseBodyweight}>
                      Add <strong>5%</strong> to reps, or not?
                      <br />
                      <label id="radio-yes-no">
                        <input type="radio" name="increaseReps" value="true" />{" "}
                        Yes!
                      </label>
                      <label id="radio-yes-no">
                        <input type="radio" name="increaseReps" value="false" />{" "}
                        No
                      </label>
                      <br />
                      <button type="submit" id="update">Update</button>
                    </form>
                  )}
                {currentExercise !== undefined &&
                  currentExercise[1] === "Timed Exercise" && (
                    <form onSubmit={progressExerciseTimed}>
                      Add <strong>5%</strong> to time, or not?
                      <br />
                      <label id="radio-yes-no">
                        <input type="radio" name="increaseTime" value="true" />{" "}
                        Yes!
                      </label>
                      <label id="radio-yes-no">
                        <input type="radio" name="increaseTime" value="false" />{" "}
                        No
                      </label>
                      <br />
                      <button type="submit" id="update">Update</button>
                    </form>
                  )}
              </>
            )}
          {exercises[workoutIndex] &&
            exercises[workoutIndex].last_difficulty === "e" && (
              <>
                <h3>{workoutName}</h3>
                <h5>You said these sets were easy last time!</h5>
                <div id="current-exercise-details">
                  {currentExercise !== undefined &&
                    currentExercise[1] === "Weighted Reps" && (
                      <>
                        <div id="workout-details">
                          <strong id="exercise-name">
                            {currentExercise[0]}
                          </strong>
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
                        <div id="workout-details">
                          <strong id="exercise-name">
                            {currentExercise[0]}
                          </strong>
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
                        <div id="workout-details">
                          <strong id="exercise-name">
                            {currentExercise[0]}
                          </strong>
                          <div id="workout-data">
                            <strong>{currentExercise[2]} seconds</strong>
                            <br /> for&nbsp;
                            <strong>{currentExercise[3]} sets</strong>
                          </div>
                        </div>
                      </>
                    )}
                </div>
                <h5 id="second-h5">Time to up the difficulty!</h5>
                {currentExercise !== undefined &&
                  currentExercise[1] === "Weighted Reps" && (
                    <form onSubmit={progressExercise}>
                      Pick you're next available weight up
                      <br />
                      <select id="progress" name="progress">
                        {[1, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10].map(
                          (increment) => (
                            <option
                              key={increment}
                              value={parseInt(currentExercise[2]) + increment}
                            >
                              {parseInt(currentExercise[2]) + increment}
                            </option>
                          )
                        )}
                      </select>
                      &nbsp;{currentExercise[3]}
                      <br />
                      <button type="submit" id="update">Update</button>
                    </form>
                  )}
                {currentExercise !== undefined &&
                  currentExercise[1] === "Bodyweight Reps" && (
                    <>
                      Lets increase those reps!
                      <br />
                      <strong>5%</strong> added
                      <br />
                      <button onClick={hideProgression} id="continue">Continue{'>>'}</button>
                    </>
                  )}

                {currentExercise !== undefined &&
                  currentExercise[1] === "Timed Exercise" && (
                    <>
                      Lets bump up that time!
                      <br />
                      <strong>5%</strong> added
                      <br />
                      <button onClick={hideProgression} id="continue">Continue{'>>'}</button>
                    </>
                  )}
              </>
            )}
        </div>
        <div id="current-exercise">
          <h3>{workoutName}</h3>
          <div id="current-exercise-details">
            {workoutIndex < exercises.length - 1 && (
              <h4 id="current-exercise-text">Current Exercise</h4>
            )}
            {workoutIndex >= exercises.length - 1 && (
              <h4 id="current-exercise-text">Last Exercise</h4>
            )}
            {currentExercise !== undefined &&
              currentExercise[1] === "Weighted Reps" && (
                <>
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
          {workoutIndex < exercises.length - 1 && (
            <div id="skip-row">
              Machine Taken?
              <button id="skip-exercise" onClick={skipExercise}>
                Skip Exercise for Now
              </button>
            </div>
          )}
          <div id="complete-exercise">
            <h5>Was the last rep difficult?</h5>
            <form onSubmit={nextExercise}>
              <label id="hard">
                <input type="radio" name="difficulty" value="hard" /> I could
                not do it...
              </label>
              <br />
              <label id="medium">
                <input type="radio" name="difficulty" value="medium" /> It was
                slow and hard.
              </label>
              <br />
              <label id="easy">
                <input type="radio" name="difficulty" value="easy" /> It moved
                easily!
              </label>
              <br />
              {workoutIndex < exercises.length - 1 && (
                <button type="submit">Next Exercise{">>"}</button>
              )}
              {workoutIndex >= exercises.length - 1 && (
                <button type="submit">Finish Workout! {">>"}</button>
              )}
            </form>
          </div>
        </div>
      </body>
    </>
  );
};

export default Workout;
