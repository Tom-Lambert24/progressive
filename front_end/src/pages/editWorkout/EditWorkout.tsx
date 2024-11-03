import React, { useState, useEffect } from "react";
import "./editWorkout.css";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { logout } from "../../helperFunctions";

const EditWorkout: React.FC = () => {
  const [username, setUsername] = useState("");
  const [selectedOption, setSelectedOption] = useState("Weighted Reps");
  const [workoutName, setWorkoutName] = useState("");
  const displayName = username ? username.split("@")[0] : "";
  const { workoutId } = useParams();
  const [submitCount, setSubmitCount] = useState(0);
  const [updateWorkoutData, setUpdateWorkoutData] = useState<any[]>([]);

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
          setUsername(data.username);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking logged in status:", error);
      }
    };

    checkLoggedIn();
  }, [navigate]);

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
        } else {
          navigate(`/user`);
        }
      } catch (error) {
        console.error("Error getting workout:", error);
      }
    };
    getWorkoutNameById();
  }, [navigate, workoutId]);

  //fetch and display current workout exercises
  useEffect(() => {
    let currentWorkoutData: any[] = [];
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

          //generate current Workout list html
          setUpdateWorkoutData(currentWorkoutData);
        }
      } catch (error) {
        console.error("Error getting workout data:", error);
      }
    };
    getWorkoutDataById();
  }, [submitCount, workoutId]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const exerciseData = [];

    const typeOfExercise = (
      (event.target as HTMLFormElement)[1] as HTMLInputElement
    ).value;

    if (typeOfExercise === "Weighted Reps") {
      const exerciseName = (
        (event.target as HTMLFormElement)[0] as HTMLInputElement
      ).value;
      const startingWeight = (
        (event.target as HTMLFormElement)[2] as HTMLInputElement
      ).value;
      const startingWeightUnit = (
        (event.target as HTMLFormElement)[3] as HTMLInputElement
      ).value;
      const noOfReps = (
        (event.target as HTMLFormElement)[4] as HTMLInputElement
      ).value;
      const noOfSets = (
        (event.target as HTMLFormElement)[5] as HTMLInputElement
      ).value;

      exerciseData.push(exerciseName);
      exerciseData.push(typeOfExercise);
      exerciseData.push(startingWeight);
      exerciseData.push(startingWeightUnit);
      exerciseData.push(noOfReps);
      exerciseData.push(noOfSets);
    }

    if (typeOfExercise === "Bodyweight Reps") {
      const exerciseName = (
        (event.target as HTMLFormElement)[0] as HTMLInputElement
      ).value;
      const noOfReps = (
        (event.target as HTMLFormElement)[2] as HTMLInputElement
      ).value;
      const noOfSets = (
        (event.target as HTMLFormElement)[3] as HTMLInputElement
      ).value;

      exerciseData.push(exerciseName);
      exerciseData.push(typeOfExercise);
      exerciseData.push(noOfReps);
      exerciseData.push(noOfSets);
    }

    if (typeOfExercise === "Timed Exercise") {
      const exerciseName = (
        (event.target as HTMLFormElement)[0] as HTMLInputElement
      ).value;
      const timeOfExercise = (
        (event.target as HTMLFormElement)[2] as HTMLInputElement
      ).value;
      const noOfSets = (
        (event.target as HTMLFormElement)[3] as HTMLInputElement
      ).value;

      exerciseData.push(exerciseName);
      exerciseData.push(typeOfExercise);
      exerciseData.push(timeOfExercise);
      exerciseData.push(noOfSets);
    }

    try {
      await fetch(
        process.env.REACT_APP_SERVER_URL + "/addExercise",
        {
          credentials: "include", // Include credentials for same-origin requests
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workoutId: workoutId,
            workoutData: exerciseData,
          }),
        }
      );
    } catch (error) {
      console.error("Error adding exercise:", error);
    }

    //reset exercise form
    const exerciseInput = document.getElementById(
      "exerciseName"
    ) as HTMLInputElement;
    exerciseInput.value = "";

    const weightInput = document.getElementById("weight") as HTMLInputElement;
    if (weightInput) {
      weightInput.value = "";
    }

    const repsInput = document.getElementById("smallInput") as HTMLInputElement;
    if (repsInput) {
      repsInput.value = "";
    }

    const timeInput = document.getElementById("time") as HTMLInputElement;
    if (timeInput) {
      timeInput.value = "";
    }

    const setsInput = document.getElementById("sets") as HTMLInputElement;
    if (setsInput) {
      setsInput.value = "";
    }

    const addExercise = document.getElementById(
      "createWorkout"
    ) as HTMLDivElement;
    addExercise.style.display = "none";

    setSubmitCount((prev) => prev + 1);

    //show add exercise button
    const addExerciseButton = document.getElementById(
      "add-exercise-button"
    ) as HTMLButtonElement;
    if (addExerciseButton) {
      addExerciseButton.style.display = "block";
    }
  };

  const showAddExercise = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const addExercise = document.getElementById(
      "createWorkout"
    ) as HTMLDivElement;
    addExercise.style.display = "block";

    const addExerciseButton = document.getElementById(
      "add-exercise-button"
    ) as HTMLButtonElement;
    if (addExerciseButton) {
      addExerciseButton.style.display = "none";
    }
  };

  const removeExercise = async (index: number) => {
    try {
      await fetch(
        process.env.REACT_APP_SERVER_URL + "/removeExercise",
        {
          credentials: "include", // Include credentials for same-origin requests
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workoutId: workoutId,
            index: index,
          }),
        }
      );
    } catch (error) {
      console.error("Error adding exercise:", error);
    }

    setSubmitCount((prev) => prev - 1);
  };

  const logoutApp = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header>
        <Link to="/user">
          <h1>progressive</h1>
        </Link>
        <button id="logout" onClick={logoutApp}>
          Logout
        </button>
      </header>
      <body>
        <h2>{displayName}</h2>
        <div id="workout">
          <h3 id="workoutName">{workoutName}</h3>
          <div id="exerciseList">
            {updateWorkoutData.map((exercise, index) => (
              <div key={index} className="exercise">
                {/* Check the exercise type */}
                {exercise[1] === "Weighted Reps" && (
                  <>
                    {/* Format for Weighted Reps */}
                    <div className="exercise-row">
                      <strong id="exercise-name">{exercise[0]}:</strong>
                      <div id="exercise-details">
                        <strong>
                          {exercise[2]} {exercise[3]}
                        </strong>{" "}
                        for <strong>{exercise[4]} reps</strong>
                        <br />
                        for <strong>{exercise[5]} sets</strong>
                      </div>
                      <button
                        id="remove-exercise"
                        onClick={() => removeExercise(index)}
                      >
                        -
                      </button>
                    </div>
                  </>
                )}
                {exercise[1] === "Bodyweight Reps" && (
                  <>
                    {/* Format for Bodyweight Reps */}
                    <div className="exercise-row">
                      <strong id="exercise-name">{exercise[0]}:</strong>
                      <div id="exercise-details">
                        <strong>{exercise[2]} reps</strong>
                        &nbsp;for <strong>{exercise[3]} sets</strong>
                      </div>

                      <button
                        id="remove-exercise"
                        onClick={() => removeExercise(index)}
                      >
                        -
                      </button>
                    </div>
                  </>
                )}
                {exercise[1] === "Timed Exercise" && (
                  <>
                    {/* Format for Timed Exercise */}
                    <div className="exercise-row">
                      <strong id="exercise-name">{exercise[0]}:</strong>
                      <div id="exercise-details">
                        <strong>{exercise[2]} seconds</strong>
                        <br />
                        for <strong>{exercise[3]} sets</strong>
                        </div>
                        <button
                          id="remove-exercise"
                          onClick={() => removeExercise(index)}
                        >
                          -
                        </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={showAddExercise}
            id="add-exercise-button"
          >
            Add Exercise
          </button>
        </div>
        <div id="createWorkout">
          <form onSubmit={handleSubmit}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <label>Exercise Name</label>
                </div>
                <div className="col-12 center-input">
                  <input type="text" maxLength={30} id="exerciseName" />
                </div>
              </div>
              <div className="row margin-top">
                <div className="col-12">
                  <label>Exercise Type</label>
                </div>
                <div className="col-12 center-input">
                  <select
                    value={selectedOption}
                    onChange={handleSelectChange}
                    id="workoutType"
                    className="center-input"
                  >
                    <option value="Weighted Reps">Weighted Reps</option>
                    <option value="Bodyweight Reps">Bodyweight Reps</option>
                    <option value="Timed Exercise">Timed Exercise</option>
                  </select>
                </div>
              </div>
              {selectedOption === "Weighted Reps" && (
                <>
                  <div className="row margin-top g-1">
                    <label>Starting Weight</label>
                    <br />
                    <div id="getWeight">
                      <input
                        type="number"
                        name="StartingWeight"
                        style={{ textAlign: "right" }}
                        id="weight"
                        min="0"
                        max="9999"
                      />
                      <select id="unit">
                        <option value="kg">Kg</option>
                        <option value="lbs">lbs</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className="row justify-content-center margin-top"
                    id="repsInput"
                  >
                    <label id="noOfReps">Number of Reps</label>
                    <input type="number" id="smallInput" min="1" max="99"/>
                  </div>
                </>
              )}

              {selectedOption === "Bodyweight Reps" && (
                <>
                  <div
                    className="row justify-content-center margin-top"
                    id="repsInput"
                  >
                    <label id="noOfReps">Number of Reps</label>
                    <input type="number" id="smallInput" min="1" max="99"/>
                  </div>
                </>
              )}

              {selectedOption === "Timed Exercise" && (
                <>
                  <div
                    className="row justify-content-center margin-top"
                    id="repsInput"
                  >
                    <label id="lengthOfTime">Starting length of time(s):</label>
                    <input type="number" id="time" min="1" max="99999"/>
                  </div>
                </>
              )}

              <div
                className="row justify-content-center margin-top"
                id="setsInput"
              >
                <label id="number-of-sets">Number of Sets</label>
                <input type="number" id="sets" />
              </div>
            </div>
            <button type="submit">Add Exercise</button>
          </form>
        </div>
      </body>
    </>
  );
};

export default EditWorkout;
