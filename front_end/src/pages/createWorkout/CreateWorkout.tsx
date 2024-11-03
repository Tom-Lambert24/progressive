import React, { useEffect } from "react";
import "./createWorkout.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../helperFunctions";

const CreateWorkout: React.FC = () => {
  const [username, setUsername] = useState("");
  const displayName = username ? username.split("@")[0] : "";
  const [workoutName, setWorkoutName] = useState("");
  const navigate = useNavigate();
  const [workoutId, setWorkoutId] = useState();

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

  const handleSubmitWorkoutName = (event: React.FormEvent) => {
    event.preventDefault();
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
  };

  useEffect(() => {
    const uploadWorkoutTitle = async () => {
      if (workoutName) {
        // only send request if workoutName is non-empty
        try {
          const response = await fetch(
            process.env.REACT_APP_SERVER_URL + "/createWorkoutName",
            {
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({ workoutName }),
            }
          );

          const data = await response.json();
          setWorkoutId(data.id);
        } catch (error) {
          console.error("Error uploading workout title:", error);
        }
      }
    };

    uploadWorkoutTitle();
  }, [workoutName]);

  useEffect(() => {
    if (workoutName && workoutId) {
      navigate(`/editWorkout/${workoutId}`);
    }
  }, [workoutId, navigate, workoutName]);

  const logoutApp = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header>
        <Link to="/user"><h1>progressive</h1></Link>
        <button id="logout" onClick={logoutApp}>Logout</button>
      </header>
        <h2>{displayName}</h2>
        <div id="getWorkoutName">
          <form onSubmit={handleSubmitWorkoutName}>
            <label>Workout Name</label>
            <br />
            <input type="text" maxLength={30} id="workout-name" />
            <br />
            <button type="button" onClick={handleSubmitWorkoutName}>
              Submit
            </button>
          </form>
        </div>
    </>
  );
};

export default CreateWorkout;
