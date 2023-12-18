import React from 'react';

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
    <div className="group bg-gray-200 text-gray-500 text-xs border-gray-200 rounded-lg shadow p-4 flex items-center justify-between">
      <div>
        {framework.icon}
        {framework.framework}
      </div>
      <Link to={'/projects/create/template'}>
        <button className="hidden group-hover:block">{'>'}</button>
      </Link>
    </div>
  );
};

export default TemplateCard;
