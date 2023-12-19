import { Duration } from 'luxon';
import React from 'react';

const FormatMillisecond = ({ time }: { time: number }) => {
  const formatTime = Duration.fromMillis(time)
    .shiftTo('days', 'hours', 'minutes', 'seconds')
    .toObject();
  return (
    <div>
      {formatTime.days !== 0 && <span>{formatTime.days}d&nbsp;</span>}
      {formatTime.hours !== 0 && <span>{formatTime.hours}h&nbsp;</span>}
      {formatTime.minutes !== 0 && <span>{formatTime.minutes}m&nbsp;</span>}
      <span>{formatTime.seconds}s</span>
    </div>
  );
};

export default FormatMillisecond;
