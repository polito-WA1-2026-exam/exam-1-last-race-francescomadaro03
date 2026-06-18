import React from 'react';
import MetroScreen from './MetroScreen';

const TimerComponent = ({ timeLeft, maxTime = 90 }) => {
  const percentage = Math.max(0, (timeLeft / maxTime) * 100);
  const timeText = timeLeft.toString().padStart(2, '0') + 's';

  return (
    <div className="w-100 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <MetroScreen
          text={timeText}
          width="100px"
          height="50px"
          fontSize="30px"
        />
      </div>
    </div>
  );
};

export default TimerComponent;
