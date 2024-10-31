import React, { useEffect, useState } from "react";
import "./userPage.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../../helperFunctions";

const UserPage: React.FC = () => {
  const [ id, setId ] = useState()
  const [username, setUsername] = useState('')

  const displayName = username ? username.split("@")[0] : "";

  const navigate = useNavigate();

  useEffect(() => {
    console.log('this ran!')
    const checkLoggedIn = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_SERVER_URL + "/loggedin", {
          credentials: 'include' // Include credentials for same-origin requests
        });

        if (response.ok) {
          const data = await response.json();
          // If logged in, redirect to user's page
          setUsername(data.username)
          setId(data.id)
        } else {
          navigate('/login')
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
    logout()
    navigate('/login')
  }

  return (
    <>
      <header>
        <h1>progressive</h1>
        <button id="logout" onClick={logoutApp}>Logout</button>
      </header>
      <body>
        <h2>{displayName}</h2>
        <div className="center-button">
          <button onClick={goToCreateWorkout}>+</button>
        </div>
      </body>
    </>
  );
};

export default UserPage;
