import React from "react";
import "./home.css";

const Home: React.FC = () => {
  return (
    <>
      <header>
        <h1>progressive</h1>
        <a id="login">Login</a>
      </header>
      <body>
        <div id="intro">
            Progressive overload is hard.
            <br />
            <br />
            Or I should say keeping track of the progress is hard.
            <br />
            <br />
            That is why I have built this app.
        </div>
        <div id="details">

        </div>
        <div id="register">
          <form>
            
          </form>
        </div>
      </body>
    </>
  );
};

export default Home;
