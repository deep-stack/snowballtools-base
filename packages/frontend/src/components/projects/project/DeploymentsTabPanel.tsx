import React, { useCallback, useMemo, useState } from 'react';

import { Button, Typography } from '@material-tailwind/react';

import DeploymentDetailsCard from './deployments/DeploymentDetailsCard';
import FilterForm, {
  FilterValue,
  StatusOptions,
} from './deployments/FilterForm';
import { DeploymentDetails } from '../../../types/project';

const DEFAULT_FILTER_VALUE: FilterValue = {
  searchedBranch: '',
  status: StatusOptions.ALL_STATUS,
};

const DeploymentsTabPanel = ({
  deployments,
}: {
  deployments: DeploymentDetails[];
}) => {
  const [filterValue, setFilterValue] = useState(DEFAULT_FILTER_VALUE);

  const productionDeployment = useMemo(() => {
    return deployments.find((deployment) => {
      return deployment.isProduction === true;
    }) as DeploymentDetails;
  }, []);

  const filteredDeployments = useMemo<DeploymentDetails[]>(() => {
    return deployments.filter((deployment) => {
      // Searched branch filter
      const branchMatch =
        !filterValue.searchedBranch ||
        deployment.branch
          .toLowerCase()
          .includes(filterValue.searchedBranch.toLowerCase());

      // Status filter
      const statusMatch =
        filterValue.status === StatusOptions.ALL_STATUS ||
        // TODO: match status field types
        (deployment.status as unknown as StatusOptions) === filterValue.status;

      const dateMatch =
        !filterValue.updateAtRange ||
        (new Date(deployment.updatedAt) >= filterValue.updateAtRange!.from! &&
          new Date(deployment.updatedAt) <= filterValue.updateAtRange!.to!);

      return branchMatch && statusMatch && dateMatch;
    }) as DeploymentDetails[];
  }, [filterValue]);

  const handleResetFilters = useCallback(() => {
    setFilterValue(DEFAULT_FILTER_VALUE);
  }, []);

  return (
    <div className="p-4">
      <FilterForm
        value={filterValue}
        onChange={(value) => setFilterValue(value)}
      />
      <div className="mt-2">
        {Boolean(filteredDeployments.length) ? (
          filteredDeployments.map((deployment, key) => {
            return (
              <DeploymentDetailsCard
                deployment={deployment}
                key={key}
                productionDeployment={productionDeployment}
              />
            );
          })
        ) : (
          <div className="h-[50vh] bg-gray-100 flex rounded items-center justify-center">
            <div className="text-center">
              <Typography variant="h5">No deployments found</Typography>
              <Typography>
                Please change your search query or filters
              </Typography>
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
