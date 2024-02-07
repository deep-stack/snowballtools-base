import React from 'react';
import toast from 'react-hot-toast';

import { IconButton, Typography } from '@material-tailwind/react';

import { Link } from 'react-router-dom';

interface TemplateDetails {
  framework: string;
  icon: string;
}
interface TemplateCardProps {
  framework: TemplateDetails;
  isGitAuth: boolean;
}

const CardDetails = ({ framework }: { framework: TemplateDetails }) => {
  return (
    <div className="h-14 group bg-gray-200 border-gray-200 rounded-lg shadow p-4 flex items-center justify-between">
      <Typography className="grow">
        {framework.icon} {framework.framework}
      </Typography>
      <div>
        <IconButton size="sm" className="rounded-full hidden group-hover:block">
          {'>'}
        </IconButton>
      </div>
    </div>
  );
};

const TemplateCard: React.FC<TemplateCardProps> = ({
  framework,
  isGitAuth,
}) => {
  return isGitAuth ? (
    <Link to="template">
      <CardDetails framework={framework} />
    </Link>
  ) : (
    <a
      onClick={() =>
        toast.error('Connect Git account to start with a template')
      }
    >
      <CardDetails framework={framework} />
    </a>
  );
};

export default TemplateCard;
