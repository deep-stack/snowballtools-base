import React from 'react';
import { useStopwatch } from 'react-timer-hook';

import FormatMillisecond from './FormatMilliSecond';

const setStopWatchOffset = (time: string) => {
  const providedTime = new Date(time);
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - providedTime.getTime();
  currentTime.setMilliseconds(currentTime.getMilliseconds() + timeDifference);
  return currentTime;
};

const Stopwatch = ({ offsetTimestamp }: { offsetTimestamp: Date }) => {
  const { totalSeconds } = useStopwatch({
    autoStart: true,
    offsetTimestamp: offsetTimestamp,
  });

  return <FormatMillisecond time={totalSeconds * 1000} />;
};

export { Stopwatch, setStopWatchOffset };
