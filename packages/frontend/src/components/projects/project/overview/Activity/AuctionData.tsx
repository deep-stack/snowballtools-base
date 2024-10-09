import { useCallback, useEffect, useState } from 'react';
import { Project } from 'gql-client';

import { CheckRoundFilledIcon, GlobeIcon, LoadingIcon } from 'components/shared/CustomIcon';
import { useGQLClient } from 'context/GQLClientContext';
import { Tag } from 'components/shared';

const CHECK_AUCTION_STATUS_INTERVAL = 2000;

export const AuctionData = ({
  project
}: {
  project: Project
}) => {
  const [isAuctionCompleted, setIsAuctionCompleted] = useState<boolean>(true);
  const client = useGQLClient();
  const getIconByAuctionStatus = (isCompleted: Boolean) => {
    return isCompleted ? <CheckRoundFilledIcon /> : <LoadingIcon className="animate-spin" />
  };

  const checkAuctionStatus = async () => {
    const result = await client.getAuctionStatus(project.auctionId);

    if (result) {
      setIsAuctionCompleted(true);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (!isAuctionCompleted) {
      checkAuctionStatus();
      intervalId = setInterval(checkAuctionStatus, CHECK_AUCTION_STATUS_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuctionCompleted]);

  const renderAuctionStatus = useCallback(
    (className?: string) => {
      return (
        <div className={className}>
          <Tag
            leftIcon={getIconByAuctionStatus(isAuctionCompleted)}
            size="xs"
          >
            {isAuctionCompleted ? 'Auction Completed' : 'Auction ongoing'}
          </Tag>
        </div>
      );
    },
    [isAuctionCompleted],
  );

  return (
    <>
      <div className="flex justify-between items-center py-3 text-sm">
        <div className="flex items-center text-elements-high-em gap-2">
          <GlobeIcon />
          <span>Auction data</span>
        </div>

        {/* AUCTION STATUS */}
        <div className="w-[10%] max-w-[110px] hidden md:flex h-fit">
          {renderAuctionStatus('w-[10%] max-w-[110px] hidden md:flex h-fit')}
        </div>
      </div>

      <div className="ml-4 mb-2">
        <p className="text-elements-low-em text-sm">
          Auction Id: {project.auctionId}
        </p>

        <p className="text-elements-low-em text-sm mt-2">
          Deployer LRNs:
        </p>

        <div>
          {project.deployerLrn.map((lrn, index) => (
            <p key={index} className="text-elements-low-em text-sm">
              {lrn}
            </p>
          ))}
        </div>
      </div>
    </>

  );
};
