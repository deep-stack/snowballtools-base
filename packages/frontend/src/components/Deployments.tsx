import React from 'react';

import deploymentDetails from '../assets/deployments.json';
import DeployDetailsCard from './DeploymentDetailsCard';

const Deployments = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
        <div className="col-span-2">
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full focus:border-blue-300 focus:outline-none focus:shadow-outline-blue"
            placeholder="Search branches"
          />
        </div>
        <div className="col-span-1">
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full focus:border-blue-300 focus:outline-none focus:shadow-outline-blue"
            placeholder="All time"
          />
        </div>
        <div className="col-span-1">
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full focus:border-blue-300 focus:outline-none focus:shadow-outline-blue"
            placeholder="All status"
          />
        </div>
      </div>
      <div className="mt-2">
        {deploymentDetails.map((deployment, key) => {
          return <DeployDetailsCard deployment={deployment} key={key} />;
        })}
      </div>
    </div>
  );
};

export default Deployments;
