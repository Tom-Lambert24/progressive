import React, { useState, useEffect } from "react";
import "./editWorkout.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const EditWorkout: React.FC = () => {
  const [username, setUsername] = useState("");
  const [id, setId] = useState();
  const [selectedOption, setSelectedOption] = useState("Weighted Reps");
  const [workoutName, setWorkoutName] = useState("");
  const displayName = username ? username.split("@")[0] : "";
  const { workoutId } = useParams();
  const Exercise = [];

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
          navigate(`/${id}`);
        }
      } catch (error) {
        console.error("Error getting workout:", error);
      }
    };
    getWorkoutNameById();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const exerciseData = []

    const typeOfExercise = ((event.target as HTMLFormElement)[1] as HTMLInputElement).value;

    if (typeOfExercise === "Weighted Reps") {
        const exerciseName = ((event.target as HTMLFormElement)[0] as HTMLInputElement).value;
        const startingWeight = ((event.target as HTMLFormElement)[2] as HTMLInputElement).value;
        const startingWeightUnit = ((event.target as HTMLFormElement)[3] as HTMLInputElement).value;
        const noOfReps = ((event.target as HTMLFormElement)[4] as HTMLInputElement).value;

        exerciseData.push(exerciseName)
        exerciseData.push(typeOfExercise)
        exerciseData.push(startingWeight)
        exerciseData.push(startingWeightUnit)
        exerciseData.push(noOfReps)
    }

    if (typeOfExercise === "Bodyweight Reps") {
        const exerciseName = ((event.target as HTMLFormElement)[0] as HTMLInputElement).value;
        const noOfReps = ((event.target as HTMLFormElement)[2] as HTMLInputElement).value;

        exerciseData.push(exerciseName)
        exerciseData.push(typeOfExercise)
        exerciseData.push(noOfReps)
    }

    if (typeOfExercise === "Timed Exercise") {
        const exerciseName = ((event.target as HTMLFormElement)[0] as HTMLInputElement).value;
        const timeOfExercise = ((event.target as HTMLFormElement)[2] as HTMLInputElement).value;

        exerciseData.push(exerciseName)
        exerciseData.push(typeOfExercise)
        exerciseData.push(timeOfExercise)
    }


    try {
      const response = await fetch(
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
  };

  return (
    <>
      <header>
        <h1>progressive</h1>
      </header>
      <body>
        <h2>{displayName}</h2>
        <div id="workout">
          <h3 id="workoutName">{workoutName}</h3>
        </div>
        <div id="createWorkout">
          <form onSubmit={handleSubmit}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <label>Exercise Name</label>
                </div>
                <div className="col-12 center-input">
                  <input type="text" maxLength={30}></input>
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
                    <input type="number" id="smallInput" />
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
                    <input type="number" id="smallInput" />
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
                    <input type="number" id="smallInput" />
                  </div>
                </>
              )}
            </div>
            <button type="submit">Add Exercise</button>
          </form>
        </div>
      </body>
    </>
  );
};

export default EditWorkout;
