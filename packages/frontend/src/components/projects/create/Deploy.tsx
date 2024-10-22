import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Deployment, DeploymentStatus } from 'gql-client';

import { DeployStep, DeployStatus } from './DeployStep';
import { Stopwatch, setStopWatchOffset } from '../../StopWatch';
import { Heading } from '../../shared/Heading';
import { Button } from '../../shared/Button';
import { ClockOutlineIcon, WarningIcon } from '../../shared/CustomIcon';
import { CancelDeploymentDialog } from '../../projects/Dialog/CancelDeploymentDialog';
import { useGQLClient } from 'context/GQLClientContext';

const FETCH_DEPLOYMENTS_INTERVAL = 5000;

const Deploy = () => {
  const client = useGQLClient();

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [open, setOpen] = React.useState(false);
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  const handleOpen = () => setOpen(!open);

  const navigate = useNavigate();
  const { orgSlug } = useParams();

  const handleCancel = useCallback(() => {
    navigate(`/${orgSlug}/projects/create`);
  }, []);

  const fetchDeployments = useCallback(async () => {
    if (!projectId) {
      return;
    }

    const { deployments } = await client.getDeployments(projectId);
    setDeployments(deployments);
  }, [client, projectId]);

  useEffect(() => {
    fetchDeployments();

    const interval = setInterval(() => {
      fetchDeployments();
    }, FETCH_DEPLOYMENTS_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [fetchDeployments]);

  useEffect(() => {
    if (
      deployments.length > 0 &&
      deployments[0].status === DeploymentStatus.Ready
    ) {
      navigate(`/${orgSlug}/projects/create/success/${projectId}`);
    }
  }, [deployments]);

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
