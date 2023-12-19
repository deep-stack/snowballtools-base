import React from 'react';

import { DeployStep, DeployStatus } from '../../../../components/DeployStep';
import {
  Stopwatch,
  setStopWatchOffset,
} from '../../../../components/StopWatch';

const Deploy = () => {
  return (
    <div>
      <div className="flex justify-between mb-6">
        <div>
          <h4>Deployment started ...</h4>
          <div className="flex">
            ^&nbsp;
            <Stopwatch
              offsetTimestamp={setStopWatchOffset(Date.now().toString())}
            />
          </div>
        </div>
        <div>
          <button className="border rounded-xl p-1 text-sm">^Cancel</button>
        </div>
      </div>
      <DeployStep
        title="Building"
        status={DeployStatus.COMPLETE}
        step="1"
        processTime="72000"
      />
      <DeployStep
        title="Deployment summary"
        status={DeployStatus.PROCESSING}
        step="2"
        startTime={Date.now().toString()}
      />
      <DeployStep
        title="Running checks"
        status={DeployStatus.NOT_STARTED}
        step="3"
      />
      <DeployStep
        title="Assigning domains"
        status={DeployStatus.NOT_STARTED}
        step="4"
      />
    </div>
  );
};

export default Deploy;
