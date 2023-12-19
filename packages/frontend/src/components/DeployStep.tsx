import React, { useState } from 'react';

import { Stopwatch, setStopWatchOffset } from './StopWatch';
import FormatMillisecond from './FormatMilliSecond';

const PROCESS_LOGS = [
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.',
  'When an unknown printer took a galley of type and scrambled it to make a type specimen book.',
];

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
    <>
      <div className="border-b-2 border-slate-200 flex justify-between p-2 gap-2">
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
      <div className={`text-sm ${!collapse ? 'hidden' : ''}`}>
        {PROCESS_LOGS.map((log, key) => {
          return <p key={key}>{log}</p>;
        })}
      </div>
    </>
  );
};

export { DeployStep, DeployStatus };
