import React, { useState } from 'react';

import { Collapse } from '@material-tailwind/react';

import { Stopwatch, setStopWatchOffset } from '../../StopWatch';
import FormatMillisecond from '../../FormatMilliSecond';
import processLogs from '../../../assets/process-logs.json';
import { cn } from 'utils/classnames';
import {
  CheckRoundFilledIcon,
  ClockOutlineIcon,
  CopyIcon,
  LoaderIcon,
  MinusCircleIcon,
  PlusIcon,
} from 'components/shared/CustomIcon';
import { Button } from 'components/shared/Button';
import { useToast } from 'components/shared/Toast';
import { useIntersectionObserver } from 'usehooks-ts';

enum DeployStatus {
  PROCESSING = 'progress',
  COMPLETE = 'complete',
  NOT_STARTED = 'notStarted',
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
  processTime,
}: DeployStepsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast, dismiss } = useToast();
  const { isIntersecting: hideGradientOverlay, ref } = useIntersectionObserver({
    threshold: 1,
  });

  const disableCollapse = status !== DeployStatus.COMPLETE;

  return (
    <div className="border-b border-border-separator">
      {/* Collapisble trigger */}
      <button
        className={cn(
          'flex justify-between w-full py-5 gap-2',
          disableCollapse && 'cursor-auto',
        )}
        tabIndex={disableCollapse ? -1 : undefined}
        onClick={() => {
          if (!disableCollapse) {
            setIsOpen((val) => !val);
          }
        }}
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
            {status === DeployStatus.COMPLETE && (
              <div className="text-controls-primary">
                {!isOpen && <PlusIcon size={24} />}
                {isOpen && <MinusCircleIcon size={24} />}
              </div>
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
            <Stopwatch offsetTimestamp={setStopWatchOffset(startTime!)} />
          </div>
        )}
        {status === DeployStatus.COMPLETE && (
          <div className="flex items-center gap-1.5">
            <CheckRoundFilledIcon className="text-elements-success" size={18} />
            <FormatMillisecond time={Number(processTime)} />{' '}
          </div>
        )}
      </button>

      {/* Collapsible */}
      <Collapse open={isOpen}>
        <div className="relative text-xs text-elements-low-em h-36 overflow-y-auto">
          {/* Logs */}
          {processLogs.map((log, key) => {
            return (
              <p className="font-mono" key={key}>
                {log}
              </p>
            );
          })}

          {/* End of logs ref used for hiding gradient overlay */}
          <div ref={ref} />

          {/* Overflow gradient overlay  */}
          {!hideGradientOverlay && (
            <div className="h-14 w-full sticky bottom-0 inset-x-0 bg-gradient-to-t from-white to-transparent" />
          )}

          {/* Copy log button */}
          <div className={cn('sticky bottom-4 left-1/2 flex justify-center')}>
            <Button
              size="xs"
              onClick={() => {
                navigator.clipboard.writeText(processLogs.join('\n'));
                toast({
                  title: 'Logs copied',
                  variant: 'success',
                  id: 'logs',
                  onDismiss: dismiss,
                });
              }}
              leftIcon={<CopyIcon size={16} />}
            >
              Copy log
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export { DeployStep, DeployStatus };
