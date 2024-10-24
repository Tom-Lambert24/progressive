import React from "react";
import "./home.css";
import { Navigate, useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate('/register')
  }

  return (
    <>
      <header>
        <h1>progressive</h1>
        <a id="login">Login</a>
      </header>
      <body>
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
      </body>
    </>
  );
};

export default Home;
