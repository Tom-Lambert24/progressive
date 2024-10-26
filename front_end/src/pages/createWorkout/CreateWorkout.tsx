import React from "react";
import "./createWorkout.css";
import { useParams } from "react-router-dom";
import { useState } from "react";

const CreateWorkout: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [selectedOption, setSelectedOption] = useState("Weighted Reps");
  const displayName = username ? username.split("@")[0] : "";

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    
  }

  return (
    <>
      <header>
        <h1>progressive</h1>
      </header>
      <body>
        <h2>{displayName}</h2>
        <div id="createWorkout">
          <form onSubmit={handleSubmit}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <label>Exersize</label>
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
                  <div className="row margin-top">
                    <label>Starting Weight</label>
                    <div className="col-10">
                      <input
                        type="number"
                        name="StartingWeight"
                        style={{ textAlign: "right" }}
                      />
                    </div>
                    <div className="col-2">
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
