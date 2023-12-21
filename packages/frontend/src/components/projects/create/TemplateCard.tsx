import React from 'react';

import { IconButton } from '@material-tailwind/react';

import { Link } from 'react-router-dom';

interface TemplateDetails {
  framework: string;
  icon: string;
}
interface TemplateCardProps {
  framework: TemplateDetails;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ framework }) => {
  return (
    <Link to={'/projects/create/template'}>
      <div className="h-14 group bg-gray-200 text-gray-500 text-xs border-gray-200 rounded-lg shadow p-4 flex items-center justify-between">
        <div className="grow">
          {framework.icon}
          {framework.framework}
        </div>
        <div>
          <IconButton size="sm" className="hidden group-hover:block">
            {'>'}
          </IconButton>
        </div>
      </div>
    </Link>
  );
};

export default TemplateCard;
