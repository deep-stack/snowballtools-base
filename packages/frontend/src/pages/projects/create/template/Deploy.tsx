import React from 'react';

import { Button } from '@material-tailwind/react';

import {
  DeployStep,
  DeployStatus,
} from '../../../../components/projects/create/template/deploy/DeployStep';
import {
  Stopwatch,
  setStopWatchOffset,
} from '../../../../components/StopWatch';
import CancelDeploymentDialog from '../../../../components/projects/create/template/deploy/CancelDeploymentDialog';

const Deploy = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);

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
          <Button onClick={handleOpen} variant="outlined" size="sm">
            ^Cancel
          </Button>
        </div>
        <CancelDeploymentDialog handleOpen={handleOpen} open={open} />
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
