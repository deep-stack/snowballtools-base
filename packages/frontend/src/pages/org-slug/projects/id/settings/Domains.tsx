import { RequestError } from 'octokit';
import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Domain } from 'gql-client';

import DomainCard from 'components/projects/project/settings/DomainCard';
import { useGQLClient } from '../../../../../context/GQLClientContext';
import { OutletContextType } from '../../../../../types';
import { useOctokit } from '../../../../../context/OctokitContext';
import { Button } from 'components/shared/Button';
import { PlusIcon } from 'components/shared/CustomIcon';
import { ProjectSettingContainer } from 'components/projects/project/settings/ProjectSettingContainer';

const Domains = () => {
  const client = useGQLClient();
  const { octokit } = useOctokit();
  const { project } = useOutletContext<OutletContextType>();

  const [domains, setDomains] = useState<Domain[]>([]);
  const [branches, setBranches] = useState<string[]>([]);

  const fetchBranches = useCallback(async () => {
    const [owner, repo] = project.repository.split('/');

    try {
      const result = await octokit.rest.repos.listBranches({
        owner,
        repo,
      });

      const branches = result.data.map((repo) => repo.name);

      setBranches(branches);
    } catch (err) {
      if (!(err instanceof RequestError && err.status === 404)) {
        throw err;
      }

      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchDomains = async () => {
    if (project === undefined) {
      return;
    }

    const fetchedDomains = await client.getDomains(project.id);
    setDomains(fetchedDomains.domains);
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  return (
    <ProjectSettingContainer
      headingText="Domains"
      button={
        <Button
          as="a"
          href="add"
          variant="secondary"
          leftIcon={<PlusIcon />}
          size="md"
        >
          Add domain
        </Button>
      }
    >
      {domains.map((domain) => {
        return (
          <DomainCard
            domains={domains}
            domain={domain}
            key={domain.id}
            // TODO: Use github API for getting linked repository
            branches={branches}
            project={project}
            onUpdate={fetchDomains}
          />
        );
      })}
    </ProjectSettingContainer>
  );
};

export default Domains;
