import React, { useEffect } from "react";
import "./createWorkout.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../UserContext";


const CreateWorkout: React.FC = () => {
  const { username } = useUser();
  const [selectedOption, setSelectedOption] = useState("Weighted Reps");
  const displayName = username ? username.split("@")[0] : "";
  const [workoutName, setWorkoutName] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    if (!displayName) {
      navigate('/login')
    }
  }, [displayName, navigate])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {};

  const handleSubmitWorkoutName = () => {
    const workoutNameInput = document.getElementById(
      "workout-name"
    ) as HTMLInputElement | null;

    if (workoutNameInput) {
      if (workoutNameInput.value !== "") {
        setWorkoutName(workoutNameInput.value);
      } else {
        setWorkoutName("New Workout");
      }
    }

    //hide div
    const workoutNameDiv = document.getElementById("getWorkoutName");

    if (workoutNameDiv) {
      workoutNameDiv.style.display = "none";
    }

    //show add exersize
    const createExersizeDiv = document.getElementById("createWorkout");

    if (createExersizeDiv) {
      createExersizeDiv.style.display = "block";
    }

    //show workout
    const workoutDiv = document.getElementById("workout");

    if (workoutDiv) {
      workoutDiv.style.display = "block";
    }
  };

  return (
    <>
      <header>
        <h1>progressive</h1>
      </header>
      <body>
        <h2>{displayName}</h2>
        <div id="getWorkoutName">
          <label>Workout Name</label>
          <br />
          <input type="text" maxLength={30} id="workout-name" />
          <br />
          <button onClick={handleSubmitWorkoutName}>Submit</button>
        </div>
        <div id="workout">
          <h3 id="workoutName">{workoutName}</h3>
        </div>
        <div id="createWorkout">
          <form onSubmit={handleSubmit}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <label>Exersize Name</label>
                </div>
                <div className="col-12 center-input">
                  <input type="text" maxLength={30}></input>
                </div>
              </div>
              <div className="row margin-top">
                <div className="col-12">
                  <label>Exersize Type</label>
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
                    <option value="Timed Exersize">Timed Exersize</option>
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

              {selectedOption === "Timed Exersize" && (
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
            <button type="submit">Add Exersize</button>
          </form>
        </div>
      </body>
    </>
  );
};

export default CreateWorkout;
