import { useCallback, useEffect, useMemo, useState } from 'react';
import { Deployment, Domain } from 'gql-client';
import { useOutletContext } from 'react-router-dom';

import DeploymentDetailsCard from 'components/projects/project/deployments/DeploymentDetailsCard';
import FilterForm, {
  FilterValue,
  StatusOptions,
} from 'components/projects/project/deployments/FilterForm';
import { OutletContextType } from '../../../../types/types';
import { useGQLClient } from 'context/GQLClientContext';
import { Button } from 'components/shared/Button';
import { RefreshIcon } from 'components/shared/CustomIcon';

const DEFAULT_FILTER_VALUE: FilterValue = {
  searchedBranch: '',
  status: StatusOptions.ALL_STATUS,
};
const FETCH_DEPLOYMENTS_INTERVAL = 5000;

const DeploymentsTabPanel = () => {
  const client = useGQLClient();

  const { project } = useOutletContext<OutletContextType>();

  const [filterValue, setFilterValue] = useState(DEFAULT_FILTER_VALUE);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [prodBranchDomains, setProdBranchDomains] = useState<Domain[]>([]);

  const fetchDeployments = useCallback(async () => {
    const { deployments } = await client.getDeployments(project.id);
    setDeployments(deployments);
  }, [client, project]);

  const fetchProductionBranchDomains = useCallback(async () => {
    const { domains } = await client.getDomains(project.id, {
      branch: project.prodBranch,
    });
    setProdBranchDomains(domains);
  }, [client, project]);

  useEffect(() => {
    fetchProductionBranchDomains();
    fetchDeployments();

    const interval = setInterval(() => {
      fetchDeployments();
    }, FETCH_DEPLOYMENTS_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [fetchDeployments, fetchProductionBranchDomains]);

  const currentDeployment = useMemo(() => {
    return deployments.find((deployment) => {
      return deployment.isCurrent === true;
    });
  }, [deployments]);

  const filteredDeployments = useMemo<Deployment[]>(() => {
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

      const startDate =
        filterValue.updateAtRange instanceof Array
          ? filterValue.updateAtRange[0]
          : null;
      const endDate =
        filterValue.updateAtRange instanceof Array
          ? filterValue.updateAtRange[1]
          : null;

      const dateMatch =
        !filterValue.updateAtRange ||
        (new Date(Number(deployment.createdAt)) >= startDate! &&
          new Date(Number(deployment.createdAt)) <= endDate!);

      return branchMatch && statusMatch && dateMatch;
    });
  }, [filterValue, deployments]);

  const handleResetFilters = useCallback(() => {
    setFilterValue(DEFAULT_FILTER_VALUE);
  }, []);

  const onUpdateDeploymentToProd = async () => {
    await fetchDeployments();
  };

  return (
    <section className="h-full">
      <FilterForm
        value={filterValue}
        onChange={(value) => setFilterValue(value)}
      />
      <div className="mt-2 h-full">
        {Boolean(filteredDeployments.length) ? (
          filteredDeployments.map((deployment, key) => {
            return (
              <DeploymentDetailsCard
                deployment={deployment}
                key={key}
                currentDeployment={currentDeployment!}
                onUpdate={onUpdateDeploymentToProd}
                project={project}
                prodBranchDomains={prodBranchDomains}
              />
            );
          })
        ) : (
          // TODO: Update the height based on the layout, need to re-styling the layout similar to create project layout
          <div className="h-3/4 bg-base-bg-alternate flex flex-col rounded-xl items-center justify-center text-center gap-5">
            <div className="space-y-1">
              <p className="font-medium tracking-[-0.011em] text-elements-high-em">
                No deployments found
              </p>
              <p className="text-sm tracking-[-0.006em] text-elements-mid-em">
                Please change your search query or filters.
              </p>
            </div>
            <Button
              variant="tertiary"
              leftIcon={<RefreshIcon />}
              onClick={handleResetFilters}
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DeploymentsTabPanel;
