import { useCallback, useEffect, useState } from 'react';
import { Auction, Project } from 'gql-client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { CheckRoundFilledIcon, LoadingIcon } from 'components/shared/CustomIcon';
import { useGQLClient } from 'context/GQLClientContext';
import { Button, Heading, Tag } from 'components/shared';

const WAIT_DURATION = 5000;

export const AuctionCard = ({ project }: { project: Project }) => {
  const [auctionStatus, setAuctionStatus] = useState<string>('');
  const [deployerLrns, setDeployerLrns] = useState<string[]>([]);
  const [auctionDetails, setAuctionDetails] = useState<Auction | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const client = useGQLClient();

  const getIconByAuctionStatus = (status: string) =>
    status === 'completed' ? <CheckRoundFilledIcon /> : <LoadingIcon className="animate-spin" />;

  const checkAuctionStatus = useCallback(async () => {
    const result = await client.getAuctionData(project.auctionId);
    setAuctionStatus(result.status);
    setAuctionDetails(result);
    setDeployerLrns(project.deployerLrns);
    }, [client, project.auctionId, project.deployerLrns]);

  useEffect(() => {
    const fetchUpdatedProject = async () => {
      if (auctionStatus === 'completed') {
        // Wait for 5 secs since the project is not immediately updated with deployer LRNs
        await new Promise((resolve) => setTimeout(resolve, WAIT_DURATION));

        const updatedProject = await client.getProject(project.id);
        setDeployerLrns(updatedProject.project!.deployerLrns || []);
      }
    };

    if (auctionStatus !== 'completed') {
      const intervalId = setInterval(checkAuctionStatus, WAIT_DURATION);
      checkAuctionStatus();

      return () => clearInterval(intervalId);
    } else {
      fetchUpdatedProject();
    }
  }, [auctionStatus, checkAuctionStatus, client]);

  const renderAuctionStatus = useCallback(
    () => (
      <Tag
        leftIcon={getIconByAuctionStatus(auctionStatus)}
        size="xs"
        type={auctionStatus === 'completed' ? 'positive' : 'emphasized'}
      >
        {auctionStatus.toUpperCase()}
      </Tag>
    ),
    [auctionStatus]
  );

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <>
      <div className="p-3 gap-2 rounded-xl border border-gray-200 transition-colors hover:bg-base-bg-alternate flex flex-col mt-8">
        <div className="flex justify-between items-center">
          <Heading className="text-lg leading-6 font-medium">Auction details</Heading>
          <Button onClick={handleOpenDialog} variant="tertiary" size="sm">
            View details
          </Button>
        </div>

        <div className="flex justify-between items-center mt-1">
          <span className="text-elements-high-em text-sm font-medium tracking-tight">Auction Status</span>
          <div className="ml-2">{renderAuctionStatus()}</div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-elements-high-em text-sm font-medium tracking-tight">Auction Id</span>
          <span className="text-elements-mid-em text-sm text-right">
            {project.auctionId}
          </span>
        </div>

        {deployerLrns?.length > 0 && (
          <div className="mt-3">
            <span className="text-elements-high-em text-sm font-medium tracking-tight">Deployer LRNs</span>
            {deployerLrns.map((lrn, index) => (
              <p key={index} className="text-elements-mid-em text-sm">
                {'\u2022'} {lrn}
              </p>
            ))}
          </div>
        )}
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Auction Details</DialogTitle>
        <DialogContent>
          {auctionDetails && <pre>{JSON.stringify(auctionDetails, null, 2)}</pre>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
