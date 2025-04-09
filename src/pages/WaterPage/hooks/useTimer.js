// src/hooks/useTimer.js
import { useState, useEffect, useRef } from 'react';

const useTimer = () => {
  // Timer state
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(0);
  const [timerHasRun, setTimerHasRun] = useState(false);
  
  // Ref for interval
  const timerRef = useRef(null);
  
  // Calculate total time whenever hours, minutes, or seconds change
  useEffect(() => {
    setTotalTimeInSeconds(hours * 3600 + minutes * 60 + seconds);
  }, [hours, minutes, seconds]);
  
  // Timer logic
  useEffect(() => {
    if (isRunning) {
      // Mark that the timer has been started at least once
      setTimerHasRun(true);
      
      timerRef.current = setInterval(() => {
        setTotalTimeInSeconds(prev => {
          if (prev <= 1) {
            // Timer finished or about to finish
            clearInterval(timerRef.current);
            setIsRunning(false);
            
            // Make sure to set all time values to 0
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            return 0;
          }
          
          // Decrement by 1 second and update display
          const newTotal = prev - 1;
          setHours(Math.floor(newTotal / 3600));
          setMinutes(Math.floor((newTotal % 3600) / 60));
          setSeconds(newTotal % 60);
          return newTotal;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isRunning]);
  
  // Handle time adjustments
  const incrementHours = () => !isRunning && setHours(prev => prev < 99 ? prev + 1 : prev);
  const decrementHours = () => !isRunning && setHours(prev => prev > 0 ? prev - 1 : prev);
  
  const incrementMinutes = () => {
    if (!isRunning) {
      if (minutes === 59) {
        setMinutes(0);
        incrementHours();
      } else {
        setMinutes(prev => prev + 1);
      }
    }
  };
  
  const decrementMinutes = () => !isRunning && setMinutes(prev => prev > 0 ? prev - 1 : prev);
  
  const incrementSeconds = () => {
    if (!isRunning) {
      if (seconds === 59) {
        setSeconds(0);
        incrementMinutes();
      } else {
        setSeconds(prev => prev + 1);
      }
    }
  };
  
  const decrementSeconds = () => !isRunning && setSeconds(prev => prev > 0 ? prev - 1 : prev);
  
  // Start/stop timer
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setHours(0);
    setMinutes(30);
    setSeconds(0);
  };
  
  // Preset timers
  const applyPreset = (h, m, s) => {
    if (!isRunning) {
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }
  };
  
  return {
    hours,
    minutes,
    seconds,
    isRunning,
    totalTimeInSeconds,
    timerHasRun,
    incrementHours,
    decrementHours,
    incrementMinutes,
    decrementMinutes,
    incrementSeconds,
    decrementSeconds,
    toggleTimer,
    resetTimer,
    applyPreset
  };
};

export default useTimer;