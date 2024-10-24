import { Stopwatch, setStopWatchOffset } from '../../StopWatch';
import { cn } from 'utils/classnames';
import {
  CheckRoundFilledIcon,
  ClockOutlineIcon,
  LoaderIcon,
} from 'components/shared/CustomIcon';

enum DeployStatus {
  PROCESSING = 'progress',
  COMPLETE = 'complete',
  NOT_STARTED = 'notStarted',
  ERROR = 'error',
}

interface DeployStepsProps {
  status: DeployStatus;
  title: string;
  step?: string;
  startTime?: string;
  processTime?: string;
}

const DeployStep = ({
  step,
  status,
  title,
  startTime,
}: DeployStepsProps) => {
  return (
    <div className="border-b border-border-separator">
      <button
        className={cn('flex justify-between w-full py-5 gap-2', 'cursor-auto')}
      >
        <div className={cn('grow flex items-center gap-3')}>
          {/* Icon */}
          <div className="w-6 h-6 grid place-content-center">
            {status === DeployStatus.NOT_STARTED && (
              <div className="grid place-content-center w-6 h-6 rounded-[48px] bg-base-bg-emphasized font-mono text-xs">
                {step}
              </div>
            )}
            {status === DeployStatus.PROCESSING && (
              <LoaderIcon className="animate-spin text-elements-link" />
            )}
          </div>

          {/* Title */}
          <span
            className={cn(
              'text-left text-sm md:text-base',
              status === DeployStatus.PROCESSING && 'text-elements-link',
            )}
          >
            {title}
          </span>
        </div>

        {/* Timer */}
        {status === DeployStatus.PROCESSING && (
          <div className="flex items-center gap-1.5">
            <ClockOutlineIcon size={16} className="text-elements-low-em" />
            <Stopwatch offsetTimestamp={setStopWatchOffset(startTime!)} isPaused={false}/>
          </div>
        )}
        {status === DeployStatus.COMPLETE && (
          <div className="flex items-center gap-1.5">
            <div className="w-4.5 h-4.5 grid place-content-center">
              <CheckRoundFilledIcon
                className="text-elements-success"
                size={15}
              />
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export { DeployStep, DeployStatus };
