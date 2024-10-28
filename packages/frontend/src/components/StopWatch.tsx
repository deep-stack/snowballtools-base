import { useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';

import FormatMillisecond, { FormatMilliSecondProps } from './FormatMilliSecond';

const setStopWatchOffset = (time: string) => {
  const providedTime = new Date(time);
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - providedTime.getTime();
  currentTime.setMilliseconds(currentTime.getMilliseconds() + timeDifference);
  return currentTime;
};

interface StopwatchProps extends Omit<FormatMilliSecondProps, 'time'> {
  offsetTimestamp: Date;
  isPaused: boolean;
}

const Stopwatch = ({ offsetTimestamp, isPaused, ...props }: StopwatchProps) => {
  const { totalSeconds, pause, start } = useStopwatch({
    autoStart: true,
    offsetTimestamp: offsetTimestamp,
  });

  useEffect(() => {
    if (isPaused) {
      pause();
    } else {
      start();
    }
  }, [isPaused]);

  return <FormatMillisecond time={totalSeconds * 1000} {...props} />;
};

export { Stopwatch, setStopWatchOffset };
