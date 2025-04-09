import React, { useState, useEffect, useRef } from 'react';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import ControlButtons from './components/ControlButtons';
import QuickPresets from './components/QuickPresets';
import DidYouKnow from './components/DidYouKnow';
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
      <div className="flex flex-col items-center min-h-screen bg-green-100 p-4 font-sans">
      
      <h2 className="text-xl text-gray-700 font-medium mb-2">Set Your Water Timer</h2>
      <div className="text-green-600 text-lg mb-4">▼</div>
      
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
      
      <DidYouKnow/>
            
      {showAlert && (
        <TimerAlert handleCloseAlert={handleCloseAlert} />
      )}

    </div>
  );
};
export default WaterPage;