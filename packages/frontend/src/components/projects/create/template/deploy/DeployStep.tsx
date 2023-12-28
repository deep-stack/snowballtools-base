import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Collapse, Button, Typography } from '@material-tailwind/react';

import { Stopwatch, setStopWatchOffset } from '../../../../StopWatch';
import FormatMillisecond from '../../../../FormatMilliSecond';
import processLogs from '../../../../../assets/process-logs.json';

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
  const [collapse, setCollapse] = useState(false);

  return (
    <div className="border-b-2">
      <div className="flex justify-between p-2 gap-2">
        {status === DeployStatus.NOT_STARTED && <div>{step}</div>}
        {status === DeployStatus.PROCESSING && <div>O</div>}
        {status === DeployStatus.COMPLETE && (
          <div>
            <button
              onClick={() => {
                setCollapse(!collapse);
              }}
            >
              {collapse ? '-' : '+'}
            </button>
          </div>
        )}
        <div className="grow">{title}</div>
        {status === DeployStatus.PROCESSING && (
          <>
            ^<Stopwatch offsetTimestamp={setStopWatchOffset(startTime!)} />
          </>
        )}
        {status === DeployStatus.COMPLETE && (
          <>
            ^<FormatMillisecond time={Number(processTime)} />{' '}
          </>
        )}
      </div>
      <Collapse open={collapse}>
        <div className="p-2 text-sm text-gray-500 h-36 overflow-y-scroll">
          {processLogs.map((log, key) => {
            return (
              <Typography variant="small" color="gray" key={key}>
                {log}
              </Typography>
            );
          })}
          <div className="sticky bottom-0 left-1/2 flex justify-center">
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(processLogs.join('\n'));
                toast.success('Logs copied');
              }}
              color="blue"
            >
              ^ Copy log
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export { DeployStep, DeployStatus };
