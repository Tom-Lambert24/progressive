import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import UserPage from './pages/userPage/UserPage'
import CreateWorkout from './pages/createWorkout/CreateWorkout';
import EditWorkout from './pages/editWorkout/EditWorkout'
import Workout from './pages/workout/Workout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login /> } />
      <Route path="/user" element={<UserPage />} />
      <Route path="/createworkout" element={<CreateWorkout />} />
      <Route path="/editWorkout/:workoutId" element={<EditWorkout />} />
      <Route path="/workout/:workoutId" element={<Workout />} />
    </Routes>
  );
}

export default App;
