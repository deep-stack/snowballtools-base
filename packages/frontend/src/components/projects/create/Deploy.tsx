import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { DeployStep, DeployStatus } from './DeployStep';
import { Stopwatch, setStopWatchOffset } from '../../StopWatch';
import { Heading } from '../../shared/Heading';
import { Button } from '../../shared/Button';
import { ClockOutlineIcon, WarningIcon } from '../../shared/CustomIcon';
import { CancelDeploymentDialog } from '../../projects/Dialog/CancelDeploymentDialog';

const TIMEOUT_DURATION = 5000;
const Deploy = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);

  const navigate = useNavigate();

  const handleCancel = useCallback(() => {
    navigate(`/projects/create`);
  }, []);

  useEffect(() => {
    const timerID = setTimeout(() => {
      navigate(`/projects/create/success/${projectId}`);
    }, TIMEOUT_DURATION);

    return () => clearInterval(timerID);
  }, []);

  return (
    <div className="space-y-7">
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <Heading as="h4" className="md:text-lg font-medium">
            Deployment started ...
          </Heading>
          <div className="flex items-center gap-1.5">
            <ClockOutlineIcon size={16} className="text-elements-mid-em" />
            <Stopwatch
              offsetTimestamp={setStopWatchOffset(Date.now().toString())}
            />
          </div>
        </div>
        <Button
          onClick={handleOpen}
          size="sm"
          variant="tertiary"
          leftIcon={<WarningIcon size={16} />}
        >
          Cancel
        </Button>
        <CancelDeploymentDialog
          handleCancel={handleOpen}
          open={open}
          handleConfirm={handleCancel}
        />
      </div>

      <div>
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
    </div>
  );
};

export default Deploy;
