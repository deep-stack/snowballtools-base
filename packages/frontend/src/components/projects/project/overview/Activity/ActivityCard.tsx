import { Link } from 'react-router-dom';
import { GitCommitWithBranch } from '../../../../../types/types';
import { Avatar } from 'components/shared/Avatar';
import { Button } from 'components/shared/Button';
import {
  ArrowRightCircleFilledIcon,
  BranchStrokeIcon,
} from 'components/shared/CustomIcon';
import { formatDistance } from 'date-fns';
import { getInitials } from 'utils/geInitials';

interface ActivityCardProps {
  activity: GitCommitWithBranch;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const formattedDate = formatDistance(
    new Date(activity.commit.author!.date!),
    new Date(),
    {
      addSuffix: true,
    },
  );

  return (
    <>
      <Link
        to={activity.html_url}
        target="_blank"
        className="p-3 gap-2 focus-within:ring-2 focus-within:ring-controls-primary/40 focus:outline-none rounded-xl transition-colors hover:bg-base-bg-alternate flex group"
      >
        <div>
          <Avatar
            type="orange"
            size={36}
            initials={getInitials(activity.commit.author?.name ?? '')}
            imageSrc={activity.author?.avatar_url}
          />
        </div>
        <div className="flex-1">
          <span className="text-elements-high-em text-sm font-medium tracking-tight">
            {activity.commit.author?.name}
          </span>
          <span className="text-elements-low-em text-xs flex items-center gap-2">
            <span title={formattedDate} className="whitespace-nowrap">
              {formattedDate}
            </span>
            {/* Dot */}
            <span className="w-0.5 h-0.5 rounded-full bg-border-interactive-hovered"></span>
            <span className="flex justify-center items-center gap-1.5">
              <div>
                <BranchStrokeIcon className="w-3 h-3" />
              </div>
              <span
                title={activity.branch.name}
                // pseudo to increase hover area
                className="before:absolute relative before:h-5 before:-top-4 before:inset-x-0"
              >
                <span className="line-clamp-1">{activity.branch.name}</span>
              </span>
            </span>
          </span>
          <p
            title={activity.commit.message}
            className="text-sm line-clamp-4 tracking-tight text-elements-mid-em mt-2"
          >
            {activity.commit.message}
          </p>
        </div>
        <Button
          aria-label="Go to commit"
          variant="unstyled"
          tabIndex={-1}
          className="p-0 text-elements-low-em group-focus-within:opacity-100 group-hover:opacity-100 opacity-0 transition-all"
          leftIcon={<ArrowRightCircleFilledIcon className="w-5 h-5" />}
        />
      </Link>
      {/* Separator calc => 100% - 36px (avatar) - 12px (padding-left) - 8px (gap)
       */}
      <div className="pt-2 mb-2 ml-auto h-1 w-[calc(100%-36px-12px-8px)] border-b border-border-separator last:border-b-transparent"></div>
    </>
  );
};

export default ActivityCard;
