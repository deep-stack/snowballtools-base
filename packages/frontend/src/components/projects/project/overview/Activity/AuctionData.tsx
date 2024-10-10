import { useCallback, useEffect, useState } from 'react';
import { Auction, Project } from 'gql-client';

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { CheckRoundFilledIcon, LoadingIcon } from 'components/shared/CustomIcon';
import { useGQLClient } from 'context/GQLClientContext';
import { Button, Tag } from 'components/shared';

const CHECK_AUCTION_STATUS_INTERVAL = 2000;

export const AuctionData = ({
  project,
}: {
  project: Project;
}) => {
  const [auctionStatus, setAuctionStatus] = useState<string>('');
  const [auctionDetails, setAuctionDetails] = useState<Auction | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const client = useGQLClient();

  const getIconByAuctionStatus = (status: string) => {
    return status === 'completed' ? (
      <CheckRoundFilledIcon />
    ) : (
      <LoadingIcon className="animate-spin" />
    );
  };

  const checkAuctionStatus = async () => {
    const result = await client.getAuctionData(project.auctionId);
    setAuctionStatus(result.status);
    setAuctionDetails(result);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (auctionStatus !== 'completed') {
      checkAuctionStatus();
      intervalId = setInterval(checkAuctionStatus, CHECK_AUCTION_STATUS_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [auctionStatus]);

  const renderAuctionStatus = useCallback(
    () => (
      <Tag leftIcon={getIconByAuctionStatus(auctionStatus)} size="xs">
        {auctionStatus.toUpperCase()}
      </Tag>
    ),
    [auctionStatus],
  );

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card variant="outlined" className="my-4">
        <CardHeader
          title="Auction Details"
          titleTypographyProps={{ variant: 'h6' }}
          action={
            <Button onClick={handleOpenDialog} variant="tertiary" size="sm">
              View details
            </Button>
          }
          sx={{ pb: 0.1 }}
        />
        <CardContent>
          <div className="flex justify-between items-center mt-1">
            <Typography variant="subtitle1">Auction Status</Typography>
            <div className="ml-2">{renderAuctionStatus()}</div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <Typography variant="subtitle1">Auction Id</Typography>
            <Typography variant="body2" className="mt-1 text-right">
              {project.auctionId}
            </Typography>
          </div>

          <Typography variant="subtitle1" className="mt-3">
            Deployer LRNs
          </Typography>
          {project.deployerLrn && (
            <div>
              {project.deployerLrn.map((lrn, index) => (
                <Typography key={index} variant="body2" className="text-elements">
                  {'\u2022'} {lrn}
                </Typography>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Auction Details</DialogTitle>
        <DialogContent>
          {auctionDetails && (
            <Typography variant="body1">
              <pre>{JSON.stringify(auctionDetails, null, 2)}</pre>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
