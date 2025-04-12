import React, { useState, useEffect, useRef } from 'react';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import ControlButtons from './components/ControlButtons';
import QuickPresets from './components/QuickPresets';
import TimerAlert from './components/TimerAlert';
import useTimer from './hooks/useTimer';

const WaterPage = () => {
  const {
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
  } = useTimer();

  const [showAlert, setShowAlert] = useState(false);
    const vibrationRef = useRef(null);
  
  useEffect(() => {
    if ('vibrate' in navigator) {
      console.log('Vibration API is supported');
    } else {
      console.log('Vibration API is not supported');
    }
  }, []);

  // Handle timer end
  useEffect(() => {
    if (totalTimeInSeconds === 0 && !isRunning && timerHasRun) {
      handleTimerEnd();
    }
  }, [totalTimeInSeconds, isRunning, timerHasRun]);
  
  // Handle timer end with alert and vibration
  const handleTimerEnd = () => {
    setShowAlert(true);

    if ('vibrate' in navigator) {
      vibrationRef.current = setInterval(() => {
        navigator.vibrate([0, 500, 200, 500]);
      }, 1500);
      console.log('Vibrating...');
    } else {
      console.log('Vibration API is not supported');
    }
  };
  
  // Stop vibration and close alert
  const handleCloseAlert = () => {
    if (vibrationRef.current) {
      clearInterval(vibrationRef.current);
      navigator.vibrate(0);
    }
    setShowAlert(false);
    resetTimer(); // Reset the timer when closing the alert
  };

  return (
    <div className="d-flex flex-column align-items-center py-4" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh' }}>
      <h2 className="text-secondary fw-medium mb-2">Set Your Water Timer</h2>
      <div className="text-success fs-5 mb-4">▼</div>
      
      <TimerDisplay hours={hours} minutes={minutes} seconds={seconds} />
      
      <TimerControls 
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        isRunning={isRunning}
        incrementHours={incrementHours}
        decrementHours={decrementHours}
        incrementMinutes={incrementMinutes}
        decrementMinutes={decrementMinutes}
        incrementSeconds={incrementSeconds}
        decrementSeconds={decrementSeconds}
      />
      
      <ControlButtons 
        isRunning={isRunning}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
      />
      
      <QuickPresets 
        applyPreset={applyPreset}
        isRunning={isRunning}
      />
                  
      {showAlert && (
        <TimerAlert handleCloseAlert={handleCloseAlert} />
      )}
    </div>
  );
};

export default WaterPage;