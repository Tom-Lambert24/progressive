import React, { useEffect } from "react";
import "./userPage.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";

const UserPage: React.FC = () => {
  const { id } = useUser()
  const { username } = useUser();

  const displayName = username ? username.split("@")[0] : "";

  const navigate = useNavigate();

  useEffect(() => {
    if (!displayName) {
      navigate('/login')
    }
  }, [displayName, navigate])

  const goToCreateWorkout = () => {
    navigate(`/${id}/createWorkout`);
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
