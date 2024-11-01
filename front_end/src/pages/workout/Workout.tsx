import React, { useEffect, useState } from "react";
import "./workout.css";
import { useParams } from "react-router-dom";

const Workout: React.FC = () => {
  const { workoutId } = useParams();
  const [exercises, setExercises] = useState<any[]>([]);
  const [workoutName, setWorkoutName] = useState();
  let currentWorkoutData: any[];

  useEffect(() => {
    const getWorkoutNameById = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_URL +
            "/getWorkout?workoutId=" +
            workoutId,
          {
            credentials: "include", // Include credentials for same-origin requests
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWorkoutName(data.workoutName);
        }
      } catch (error) {
        console.error("Error getting workout:", error);
      }
    };
    getWorkoutNameById();
  }, []);

  useEffect(() => {
    const getWorkoutDataById = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_URL +
            "/getWorkoutData?workoutId=" +
            workoutId,
          {
            credentials: "include", // Include credentials for same-origin requests
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          currentWorkoutData = [];

          if (data.workoutData) {
            for (let i = 0; i < data.workoutData.length; i++) {
              currentWorkoutData.push(
                data.workoutData[i].workout_data.workoutData
              );
            }
          }

          setExercises(currentWorkoutData);
        }
      } catch (error) {
        console.error("Error getting workout data:", error);
      }
    };
    getWorkoutDataById();
  }, []);

  useEffect(() => {
    console.log(exercises)
  }, [exercises])

  return <>
  <h3>{workoutName}</h3>
  </>;
};

export default Workout;
