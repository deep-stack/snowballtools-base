import { RequestError } from 'octokit';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Domain } from 'gql-client';

import { Button, Typography } from '@material-tailwind/react';

import DomainCard from '../../../../../components/projects/project/settings/DomainCard';
import { useGQLClient } from '../../../../../context/GQLClientContext';
import { OutletContextType } from '../../../../../types';
import { useOctokit } from '../../../../../context/OctokitContext';

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
    <>
      <div className="flex justify-between p-2">
        <Typography variant="h3" placeholder={''}>
          Domain
        </Typography>
        <Link to="add">
          <Button
            color="blue"
            variant="outlined"
            className="rounded-full"
            placeholder={''}
          >
            <i>^</i> Add domain
          </Button>
        </Link>
      </div>

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
    </>
  );
};

export default Domains;
