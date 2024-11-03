import React from "react";
import "./register.css";
import dotenv from "dotenv";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

dotenv.config();

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  });

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
          // If logged in, redirect to user's page
          setUsername(data.username);
          navigate(`/user`);
        }
      } catch (error) {
        console.error("Error checking logged in status:", error);
      }
    };

    checkLoggedIn();
  }, []);

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

      const newErrors = { username: "", password: "", repeatPassword: "" };

      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_URL + "/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              username: usernameInput.value,
              password: passwordInput.value,
            }),
          }
        );

        if (!response.ok) {
          newErrors.username = "Email already exists";
          setErrors(newErrors)
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        } else {
          navigate("/login");
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

  const goToHome = () => {
    navigate("/");
  };

  return (
    <>
      <header>
        <a onClick={goToHome}>
          <h1>progressive</h1>
        </a>
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
