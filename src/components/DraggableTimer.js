import React, { useEffect, useState } from "react";
import { useTimer } from '../state/context/useTimer';
import Draggable from "react-draggable";

const DraggableTimer = () => {
  const { timerVisible, elapsedTime, setElapsedTime, setTimerVisible } = useTimer();
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    if (timerVisible) {
      setTimerInterval(
        setInterval(() => {
          setElapsedTime((prev) => prev + 1);
        }, 1000)
      );
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [timerVisible]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    clearInterval(timerInterval);
    setTimerVisible(false); // Hide the timer
  };

  if (!timerVisible) return null;

  return (
    <Draggable>
      <div
        style={{
          position: "fixed",
          top: "100px",
          right: "10px",
          cursor: "move",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
        className="px-3 py-1 bg-primary text-sm text-white font-semibold rounded-lg shadow"
      >
        <span>Scanning: {formatTime(elapsedTime)}</span>
        <button
          onClick={handleClose}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
    </Draggable>
  );
};

export default DraggableTimer;
