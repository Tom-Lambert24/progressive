import React from "react";
import "./userPage.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  const displayName = username ? username.split("@")[0] : "";

  const navigate = useNavigate();

  const goToCreateWorkout = () => {
    navigate(`/${username}/createWorkout`);
  };

  return (
    <>
      <header>
        <h1>progressive</h1>
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
