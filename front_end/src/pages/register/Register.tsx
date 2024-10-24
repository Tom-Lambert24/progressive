import React from "react";
import "./register.css";
import dotenv from "dotenv";
import { useState } from "react";

dotenv.config();

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({ username: "", password: "", repeatPassword: "" });

    let isValid = true;
    const newErrors = { username: "", password: "", repeatPassword: "" };

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(username)) {
      newErrors.username = "Enter a valid email address.";
      isValid = false;
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      isValid = false;
    }

    if (repeatPassword !== password) {
      newErrors.repeatPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);

    //form submission
    if (isValid) {
      const form = event.target as HTMLFormElement;

      const usernameInput = form[0] as HTMLInputElement;
      const passwordInput = form[1] as HTMLInputElement;

      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_URL + "/register",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              username: usernameInput.value,
              password: passwordInput.value,
            }),
          }
        );

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
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </div>
            <div className="row">
              <div className="col">
                <label>Email</label>
              </div>
              <div className="col">
                <input
                  type="email"
                  name="email"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
            <div className="row">
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
            <div className="row">
              <div className="col">
                <label>Password</label>
              </div>
              <div className="col">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row">
              {errors.repeatPassword && (
                <span className="error">{errors.repeatPassword}</span>
              )}
            </div>
            <div className="row">
              <div className="col">
                <label>Confirm Password</label>
              </div>
              <div className="col">
                <input
                  type="password"
                  name="repeatPassword"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                />
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
