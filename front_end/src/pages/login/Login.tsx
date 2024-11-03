import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login: React.FC = () => {
  const [ username, setUsername ] = useState('');
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  //check if already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_SERVER_URL + "/notLoggedIn", {
          credentials: 'include' // Include credentials for same-origin requests
        });

        if (!response.ok) {
          // If logged in, redirect to user's page
          navigate(`/user`);
        }
      } catch (error) {
        console.error("Error checking logged in status:", error);
      }
    };

    checkLoggedIn();
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({ username: "", password: "" }); // Clear previous errors

    let isValid = true;
    const newErrors = { username: "", password: "" };

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(username)) {
      newErrors.username = "Enter a valid email address.";
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_URL + "/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
          }
        );

        if (response.ok) {
          navigate(`/user`);
        } else {
          const errorData = await response.json();
          setErrors({ username: errorData.message, password: "" }); // Update error message
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    } else {
      setErrors(newErrors); // Set validation errors
    }
  };


  return (
    <>
      <header>
        <Link to={"/"}><h1>progressive</h1></Link>
      </header>
      <div id="registration">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="row">
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </div>
            <div className="row">
              <div className="col-3">
                <label>Email</label>
              </div>
              <div className="col-9">
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              <div className="col-3">
                <label>Password</label>
              </div>
              <div className="col-9">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-auto">
              <button type="submit" id="login-button">Login</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
