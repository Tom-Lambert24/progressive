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
          process.env.REACT_APP_SERVER_URL + "/getWorkout?workoutId=" + workoutId,
          {
            credentials: "include", // Include credentials for same-origin requests
            headers: {
                "Content-Type" : "application/json"
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWorkoutName(data.workoutName)
        } else {
          navigate(`/${id}`);
        }
      } catch (error) {
        console.error("Error getting workout:", error);
      }
    };
    getWorkoutNameById()
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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

export default EditWorkout;
