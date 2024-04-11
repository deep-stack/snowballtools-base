import { Duration } from 'luxon';
import { ComponentPropsWithoutRef } from 'react';
import { cn } from 'utils/classnames';

export interface FormatMilliSecondProps
  extends ComponentPropsWithoutRef<'div'> {
  time: number;
}

const FormatMillisecond = ({ time, ...props }: FormatMilliSecondProps) => {
  const formatTime = Duration.fromMillis(time)
    .shiftTo('days', 'hours', 'minutes', 'seconds')
    .toObject();

  return (
    <div
      {...props}
      className={cn('text-sm text-elements-mid-em', props?.className)}
    >
      {formatTime.days !== 0 && <span>{formatTime.days}d&nbsp;</span>}
      {formatTime.hours !== 0 && <span>{formatTime.hours}h&nbsp;</span>}
      {formatTime.minutes !== 0 && <span>{formatTime.minutes}m&nbsp;</span>}
      <span>{formatTime.seconds}s</span>
    </div>
  );
};

export default FormatMillisecond;
