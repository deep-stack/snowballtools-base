import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Project, Domain } from 'gql-client';

import { Button, Typography } from '@material-tailwind/react';

import DeploymentDetailsCard from './deployments/DeploymentDetailsCard';
import FilterForm, {
  FilterValue,
  StatusOptions,
} from './deployments/FilterForm';
import { DeploymentDetails } from '../../../types/project';
import { useGQLClient } from '../../../context/GQLClientContext';
import { COMMIT_DETAILS } from '../../../constants';

const DEFAULT_FILTER_VALUE: FilterValue = {
  searchedBranch: '',
  status: StatusOptions.ALL_STATUS,
};

const DeploymentsTabPanel = ({ project }: { project: Project }) => {
  const client = useGQLClient();

  const [filterValue, setFilterValue] = useState(DEFAULT_FILTER_VALUE);
  const [deployments, setDeployments] = useState<DeploymentDetails[]>([]);
  const [prodBranchDomains, setProdBranchDomains] = useState<Domain[]>([]);

  const fetchDeployments = async () => {
    const { deployments } = await client.getDeployments(project.id);
    const updatedDeployments = deployments.map((deployment) => {
      return {
        ...deployment,
        author: '',
        commit: COMMIT_DETAILS,
      };
    });
    setDeployments(updatedDeployments);
  };

  const fetchProductionBranchDomains = useCallback(async () => {
    const { domains } = await client.getDomains(project.id, {
      branch: project.prodBranch,
    });
    setProdBranchDomains(domains);
  }, []);

  useEffect(() => {
    fetchDeployments();
    fetchProductionBranchDomains();
  }, []);

  const currentDeployment = useMemo(() => {
    return deployments.find((deployment) => {
      return deployment.isCurrent === true;
    });
  }, [deployments]);

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
  }, [filterValue, deployments]);

  const handleResetFilters = useCallback(() => {
    setFilterValue(DEFAULT_FILTER_VALUE);
  }, []);

  const onUpdateDeploymenToProd = async () => {
    await fetchDeployments();
  };

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
                currentDeployment={currentDeployment!}
                onUpdate={onUpdateDeploymenToProd}
                project={project}
                prodBranchDomains={prodBranchDomains}
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
