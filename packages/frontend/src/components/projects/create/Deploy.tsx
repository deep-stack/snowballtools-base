import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { DeployStep, DeployStatus } from './DeployStep';
import { Stopwatch, setStopWatchOffset } from '../../StopWatch';
import { Heading } from '../../shared/Heading';
import { Button } from '../../shared/Button';
import { ClockOutlineIcon, WarningIcon } from '../../shared/CustomIcon';
import { CancelDeploymentDialog } from '../../projects/Dialog/CancelDeploymentDialog';
import { useGQLClient } from 'context/GQLClientContext';

const FETCH_DEPLOYMENTS_INTERVAL = 5000;

type RequestState =
  | 'SUBMITTED'
  | 'DEPLOYING'
  | 'DEPLOYED'
  | 'REMOVED'
  | 'CANCELLED'
  | 'ERROR';

type Record = {
  id: string;
  createTime: string;
  app: string;
  lastState: RequestState;
  lastUpdate: string;
  logAvailable: boolean;
};

const Deploy = () => {
  const client = useGQLClient();

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [open, setOpen] = React.useState(false);
  const [record, setRecord] = useState<Record>();

  const handleOpen = () => setOpen(!open);

  const navigate = useNavigate();
  const { orgSlug } = useParams();

  const handleCancel = useCallback(() => {
    navigate(`/${orgSlug}/projects/create`);
  }, []);

  const showSteps = useMemo(() => {
    if (!record) {
      return true;
    }

    // Not checking for `REMOVED` status as this status is received for a brief period before receiving `DEPLOYED` status
    if (record.lastState === 'CANCELLED' || record.lastState === 'ERROR') {
      return false;
    } else {
      return true;
    }
  }, [record]);

  const showTimer = useMemo(() => {
    if (!record) {
      return true;
    }

    // Not checking for `REMOVED` status as this status is received for a brief period before receiving `DEPLOYED` status
    if (
      record.lastState === 'CANCELLED' ||
      record.lastState === 'ERROR' ||
      record.lastState === 'DEPLOYED'
    ) {
      return false;
    } else {
      return true;
    }
  }, [record]);

  const fetchDeploymentRecords = useCallback(async () => {
    if (!projectId) {
      return;
    }

    const { deployments } = await client.getDeployments(projectId);
    const deployment = deployments[0];

    try {
      const response = await fetch(
        `${deployment.deployer.deployerApiUrl}/${deployment.applicationDeploymentRequestId}`,
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const record: Record = await response.json();
      setRecord(record);
    } catch (err: any) {
      console.log('Error fetching data from deployer', err);
    }
  }, [client, projectId]);

  useEffect(() => {
    fetchDeploymentRecords();

    const interval = setInterval(() => {
      fetchDeploymentRecords();
    }, FETCH_DEPLOYMENTS_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [fetchDeploymentRecords]);

  useEffect(() => {
    if (!record) {
      return;
    }

    if (record.lastState === 'DEPLOYED') {
      navigate(`/${orgSlug}/projects/create/success/${projectId}`);
    }
  }, [record]);

  return (
    <div className="space-y-7">
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <Heading as="h4" className="md:text-lg font-medium">
            Deployment started ...
          </Heading>
          {showTimer && (
            <div className="flex items-center gap-1.5">
              <ClockOutlineIcon size={16} className="text-elements-mid-em" />
              <Stopwatch
                offsetTimestamp={setStopWatchOffset(Date.now().toString())}
              />
            </div>
          )}
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

      {showSteps ? (
        <div>
          <DeployStep
            title={record ? 'Submitted' : 'Submitting'}
            status={record ? DeployStatus.COMPLETE : DeployStatus.PROCESSING}
            step="1"
          />

          <DeployStep
            title={
              record && record.lastState === 'DEPLOYED'
                ? 'Deployed'
                : 'Deploying'
            }
            status={
              !record
                ? DeployStatus.NOT_STARTED
                : record.lastState === 'DEPLOYED'
                  ? DeployStatus.COMPLETE
                  : DeployStatus.PROCESSING
            }
            step="2"
            startTime={Date.now().toString()}
          />
        </div>
      ) : (
        <div>
          <DeployStep title={record!.lastState} status={DeployStatus.ERROR} />
        </div>
      )}
    </div>
  );
};

export default Deploy;
