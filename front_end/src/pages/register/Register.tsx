import React from "react";
import "./register.css";
import dotenv from "dotenv";

dotenv.config();

const Register: React.FC = () => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const username = form[0] as HTMLInputElement;
    const password = form[1] as HTMLInputElement;
    const samePassword = form[2] as HTMLInputElement;

    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + "/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Fetch error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <>
      <header>
        <h1>progressive</h1>
      </header>
      <div id="registration">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="row">
              <div className="col">
                <label>Email</label>
              </div>
              <div className="col">
                <input type="email" name="email" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Password</label>
              </div>
              <div className="col">
                <input type="password" name="password" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Confirm Password</label>
              </div>
              <div className="col">
                <input type="password" name="samePassword" />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-auto">
              <button type="submit">Register</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
