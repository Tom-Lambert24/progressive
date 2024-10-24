import React from "react";
import "./login.css";
import { useState } from "react";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
      username: "",
      password: "",
    });
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({ username: "", password: "" });

    let isValid = true;
    const newErrors = { username: "", password: "" };

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(username)) {
      newErrors.username = "Enter a valid email address.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
        //search database for username and hash password match
    }
  };

  return (
    <>
      <header>
        <h1>progressive</h1>
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
          </div>
          <div className="row justify-content-center">
            <div className="col-auto">
              <button type="submit">Login</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
