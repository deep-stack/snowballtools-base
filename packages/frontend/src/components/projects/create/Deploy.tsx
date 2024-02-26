import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Button, Typography } from '@material-tailwind/react';

import { DeployStep, DeployStatus } from './DeployStep';
import { Stopwatch, setStopWatchOffset } from '../../StopWatch';
import ConfirmDialog from '../../shared/ConfirmDialog';

const INTERVAL_DURATION = 5000;
const Deploy = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);

  const navigate = useNavigate();
  const { orgSlug } = useParams();

  const handleCancel = useCallback(() => {
    navigate(`/${orgSlug}/projects/create`);
  }, []);

  useEffect(() => {
    const timerID = setTimeout(() => {
      navigate(`/${orgSlug}/projects/create/success/${projectId}`);
    }, INTERVAL_DURATION);

    return () => clearInterval(timerID);
  }, []);

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
          <Button
            onClick={handleOpen}
            variant="outlined"
            size="sm"
            placeholder={''}
          >
            ^ Cancel
          </Button>
        </div>
        <ConfirmDialog
          dialogTitle="Cancel deployment?"
          handleOpen={handleOpen}
          open={open}
          confirmButtonTitle="Yes, Cancel deployment"
          handleConfirm={handleCancel}
          color="red"
        >
          <Typography variant="small" placeholder={''}>
            This will halt the deployment and you will have to start the process
            from scratch.
          </Typography>
        </ConfirmDialog>
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
