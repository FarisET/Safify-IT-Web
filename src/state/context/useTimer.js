import React, { createContext, useContext, useState } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timerVisible, setTimerVisible] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  return (
    <TimerContext.Provider
      value={{ timerVisible, setTimerVisible, elapsedTime, setElapsedTime }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
