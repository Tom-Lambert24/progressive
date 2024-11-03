import React, { useEffect } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_SERVER_URL + "/loggedin", {
          credentials: 'include' // Include credentials for same-origin requests
        });

        if (response.ok) {
          navigate(`/user`);
        }
      } catch (error) {
        console.error("Error checking logged in status:", error);
      }
    };

    checkLoggedIn();
  }, [navigate]);

  const goToRegister = () => {
    navigate('/register')
  }

  const goToLogin = () => {
    navigate('/login')
  }

  return (
    <>
      <header>
        <h1>progressive</h1>
        <button id="login" onClick={goToLogin}>Login</button>
      </header>
        <div id="intro">
            Progressive overload is hard...
            <br />
            <br />
            Actually, I should say, keeping track of the progress is hard.
            <br />
            <br />
            That is why I have built this app.
        </div>
        <div id="details">

        </div>
        <button id="register" onClick={goToRegister} >Register For Free</button>
    </>
  );
};

export default Home;
