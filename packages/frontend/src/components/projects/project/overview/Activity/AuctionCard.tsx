import { useCallback, useEffect, useState } from 'react';
import { Auction, Deployer, Project } from 'gql-client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import {
  CheckRoundFilledIcon,
  LoadingIcon,
} from 'components/shared/CustomIcon';
import { useGQLClient } from 'context/GQLClientContext';
import { Button, Heading, Tag } from 'components/shared';

const WAIT_DURATION = 5000;

const DIALOG_STYLE = {
  backgroundColor: 'rgba(0,0,0, .9)',
  padding: '2em',
  borderRadius: '0.5em',
  marginLeft: '0.5em',
  marginRight: '0.5em',
  color: 'gray',
  fontSize: 'small',
};

export const AuctionCard = ({ project }: { project: Project }) => {
  const [auctionStatus, setAuctionStatus] = useState<string>('');
  const [deployers, setDeployers] = useState<Deployer[]>([]);
  const [fundsStatus, setFundsStatus] = useState<boolean>(false);
  const [auctionDetails, setAuctionDetails] = useState<Auction | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const client = useGQLClient();

  const getIconByAuctionStatus = (status: string) =>
    status === 'completed' ? (
      <CheckRoundFilledIcon />
    ) : (
      <LoadingIcon className="animate-spin" />
    );

  const checkAuctionStatus = useCallback(async () => {
    const result = await client.getAuctionData(project.auctionId);
    setAuctionStatus(result.status);
    setAuctionDetails(result);
    setDeployers(project.deployers);
    setFundsStatus(project.fundsReleased);
  }, []);

  useEffect(() => {
    if (auctionStatus !== 'completed') {
      checkAuctionStatus();
      const intervalId = setInterval(checkAuctionStatus, WAIT_DURATION);
      return () => clearInterval(intervalId);
    }

    if (auctionStatus === 'completed') {
      const fetchUpdatedProject = async () => {
        // Wait for 5 secs since the project is not immediately updated with deployer LRNs
        await new Promise((resolve) => setTimeout(resolve, WAIT_DURATION));
        const updatedProject = await client.getProject(project.id);
        setDeployers(updatedProject.project?.deployers || []);
      };
      fetchUpdatedProject();
    }
  }, [auctionStatus, client]);

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
    [auctionStatus],
  );

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <>
      <div className="p-3 gap-2 rounded-xl border border-gray-200 transition-colors hover:bg-base-bg-alternate flex flex-col mt-8">
        <div className="flex justify-between items-center">
          <Heading className="text-lg leading-6 font-medium">
            Auction details
          </Heading>
          <Button onClick={handleOpenDialog} variant="tertiary" size="sm">
            View details
          </Button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-elements-high-em text-sm font-medium tracking-tight">
            Auction Id
          </span>
          <span className="text-elements-mid-em text-sm text-right">
            {project.auctionId}
          </span>
        </div>


        <div className="flex justify-between items-center mt-1">
          <span className="text-elements-high-em text-sm font-medium tracking-tight">
            Auction Status
          </span>
          <div className="ml-2">{renderAuctionStatus()}</div>
        </div>

        {auctionStatus === 'completed' && (
          <>
            {deployers?.length > 0 ? (
              <div>
                <span className="text-elements-high-em text-sm font-medium tracking-tight">
                  Deployer LRNs
                </span>
                {deployers.map((deployer, index) => (
                  <p key={index} className="text-elements-mid-em text-sm">
                    {'\u2022'} {deployer.deployerLrn}
                  </p>
                ))}

                <div className="flex justify-between items-center mt-1">
                  <span className="text-elements-high-em text-sm font-medium tracking-tight">
                    Deployer Funds Status
                  </span>
                  <div className="ml-2">
                    <Tag size="xs" type={fundsStatus ? 'positive' : 'emphasized'}>
                      {fundsStatus ? 'RELEASED' : 'LOCKED'}
                    </Tag>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <span className="text-elements-high-em text-sm font-medium tracking-tight">
                  No winning deployers
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Auction Details</DialogTitle>
        <DialogContent style={DIALOG_STYLE}>
          {auctionDetails && (
            <pre>{JSON.stringify(auctionDetails, null, 2)}</pre>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
