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
}

const Stopwatch = ({ offsetTimestamp, ...props }: StopwatchProps) => {
  const { totalSeconds } = useStopwatch({
    autoStart: true,
    offsetTimestamp: offsetTimestamp,
  });

  return <FormatMillisecond time={totalSeconds * 1000} {...props} />;
};

export { Stopwatch, setStopWatchOffset };
