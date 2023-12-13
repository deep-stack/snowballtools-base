import React from 'react';

interface TemplateDetails {
  framework: string;
  icon: string;
}
interface TemplateCardProps {
  framework: TemplateDetails;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ framework }) => {
  return (
    <div className="bg-gray-200 text-gray-500 text-xs border-gray-200 rounded-lg shadow p-4">
      {framework.icon}
      {framework.framework}
    </div>
  );
};

export default TemplateCard;
