import React from 'react';
import toast from 'react-hot-toast';

import { IconButton, Typography } from '@material-tailwind/react';

import { Link } from 'react-router-dom';

interface TemplateDetails {
  id: string;
  name: string;
  icon: string;
}
interface TemplateCardProps {
  template: TemplateDetails;
  isGitAuth: boolean;
}

const CardDetails = ({ template }: { template: TemplateDetails }) => {
  return (
    <div className="h-14 group bg-gray-200 border-gray-200 rounded-lg shadow p-4 flex items-center justify-between">
      <Typography className="grow">
        {template.icon} {template.name}
      </Typography>
      <div>
        <IconButton size="sm" className="rounded-full hidden group-hover:block">
          {'>'}
        </IconButton>
      </div>
    </div>
  );
};

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isGitAuth }) => {
  return isGitAuth ? (
    <Link to={`template?templateId=${template.id}`}>
      <CardDetails template={template} />
    </Link>
  ) : (
    <a
      onClick={() =>
        toast.error('Connect Git account to start with a template')
      }
    >
      <CardDetails template={template} />
    </a>
  );
};

export default TemplateCard;
