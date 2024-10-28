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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login /> } />
      <Route path="/:id" element={<UserPage />} />
      <Route path="/:id/createworkout" element={<CreateWorkout />} />
      <Route path="/:id/editWorkout/:workoutId" element={<EditWorkout />} />
    </Routes>
  );
}

export default App;
