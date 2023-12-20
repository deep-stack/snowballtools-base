import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@material-tailwind/react';

import deploymentData from '../../../assets/deployments.json';
import DeployDetailsCard from './DeploymentDetailsCard';
import Dropdown from '../../Dropdown';
import SearchBar from '../../SearchBar';

const STATUS_OPTIONS = [
  { value: 'building', label: 'Building' },
  { value: 'ready', label: 'Ready' },
  { value: 'error', label: 'Error' },
];

const DeploymentsTabPanel = () => {
  const [searchedBranch, setSearchedBranch] = useState('');

  const filteredDeployments = useMemo(() => {
    if (searchedBranch) {
      return deploymentData.filter((deployment) =>
        deployment.branch.toLowerCase().includes(searchedBranch.toLowerCase()),
      );
    }

    return deploymentData;
  }, [searchedBranch]);

  const handleResetFilters = useCallback(() => {
    setSearchedBranch('');
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
        <div className="col-span-2">
          <SearchBar
            placeholder="Search branches"
            value={searchedBranch}
            onChange={(event) => setSearchedBranch(event.target.value)}
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
          <Dropdown
            placeholder="All status"
            options={STATUS_OPTIONS}
            onChange={() => {}}
          />
        </div>
      </div>
      <div className="mt-2">
        {Boolean(filteredDeployments.length) ? (
          filteredDeployments.map((deployment, key) => {
            return <DeployDetailsCard deployment={deployment} key={key} />;
          })
        ) : (
          <div className="h-[50vh] bg-gray-100 flex rounded items-center justify-center">
            <div className="text-center">
              <h5 className="text-lg font-bold">No deployments found</h5>
              <p>Please change your search query or filters</p>
              <Button
                className="rounded-full mt-5"
                color="white"
                onClick={handleResetFilters}
              >
                ^ Reset filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentsTabPanel;
