import React, { useEffect, useMemo, useState } from 'react';
import { Domain, DomainStatus, GitType } from 'gql-client';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { RequestError } from 'octokit';
import { GitClient } from 'git-client';

import { useOctokit } from '../../../../context/OctokitContext';
import { GitCommitWithBranch, OutletContextType } from '../../../../types';
import { useGQLClient } from '../../../../context/GQLClientContext';
import { Button } from 'components/shared/Button';
import { Heading } from 'components/shared/Heading';
import { Avatar } from 'components/shared/Avatar';
import { getInitials } from 'utils/geInitials';
import {
  BranchStrokeIcon,
  CheckRoundFilledIcon,
  ClockIcon,
  CursorBoxIcon,
  GithubStrokeIcon,
  GlobeIcon,
  LinkIcon,
  StorageIcon,
} from 'components/shared/CustomIcon';
import { Tag } from 'components/shared/Tag';
import { Activity } from 'components/projects/project/overview/Activity';
import { OverviewInfo } from 'components/projects/project/overview/OverviewInfo';
import { CalendarDaysIcon } from 'components/shared/CustomIcon/CalendarDaysIcon';
import { relativeTimeMs } from 'utils/time';
import { useGitClient } from 'context/GitClientContext';

const COMMITS_PER_PAGE = 4;

const OverviewTabPanel = () => {
  const { octokit } = useOctokit();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<GitCommitWithBranch[]>([]);
  const [liveDomain, setLiveDomain] = useState<Domain>();
  const { gitHubClient, giteaClient } = useGitClient();

  const client = useGQLClient();

  const { project } = useOutletContext<OutletContextType>();

  const gitClient = useMemo<GitClient | undefined>(() => {
    if (project.gitType === GitType.GitHub) {
      return gitHubClient;
    } else if (project.gitType === GitType.Gitea) {
      return giteaClient;
    }
  }, [project]);

  useEffect(() => {
    // TODO: Save repo commits in DB and avoid using GitHub API in frontend
    // TODO: Figure out fetching latest commits for all branches
    const fetchRepoActivity = async () => {
      try {
        const [owner, repo] = project.repository.split('/');

        if (!repo) {
          // Do not fetch branches if repo not available
          return;
        }

        // Get all branches in project repo
        const branches = await gitClient!.getBranches(owner, repo);
        // Get first 4 commits from repo branches
        const commitsByBranchPromises = branches.map(async (branch) => {
          const result = await gitClient!.getCommits(owner, repo, branch.name);

          return result.map((data) => ({
            ...data,
            branch,
          }));
        });

        const commitsByBranch = await Promise.all(commitsByBranchPromises);
        const commitsWithBranch = commitsByBranch.flat();

        // Order commits by date and set latest 4 commits in activity section
        const orderedCommits = commitsWithBranch
          .sort(
            (a, b) =>
              new Date(b.commit.author!.date!).getTime() -
              new Date(a.commit.author!.date!).getTime(),
          )
          .slice(0, COMMITS_PER_PAGE);

        setActivities(orderedCommits);
      } catch (err) {
        if (!(err instanceof RequestError)) {
          throw err;
        }

        // TODO: Show warning in activity section on request error
        console.log(err.message);
      }
    };

    fetchRepoActivity();
  }, [octokit, project]);

  useEffect(() => {
    const fetchLiveProdDomain = async () => {
      const { domains } = await client.getDomains(project.id, {
        branch: project.prodBranch,
        status: DomainStatus.Live,
      });

      if (domains.length === 0) {
        return;
      }

      setLiveDomain(domains[0]);
    };

    fetchLiveProdDomain();
  }, [project]);

  return (
    <div className="grid grid-cols-5 gap-[72px]">
      <div className="col-span-3">
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            size={48}
            initials={getInitials(project.name)}
            imageSrc={project.icon}
            type="blue"
          />
          <div className="flex-1 space-y-1">
            <Heading className="text-lg leading-6 font-medium">
              {project.name}
            </Heading>
            <span className="text-sm text-elements-low-em tracking-tight">
              {project.subDomain}
            </span>
          </div>
        </div>
        <OverviewInfo label="Domain" icon={<GlobeIcon />}>
          {liveDomain ? (
            <Tag type="positive" size="xs" leftIcon={<CheckRoundFilledIcon />}>
              Connected
            </Tag>
          ) : (
            <div className="flex items-center gap-2">
              <Tag type="attention" size="xs" leftIcon={<ClockIcon />}>
                Not connected
              </Tag>
              <Button
                onClick={() => {
                  navigate('settings/domains');
                }}
                variant="tertiary"
                size="sm"
              >
                Setup
              </Button>
            </div>
          )}
        </OverviewInfo>
        {project.deployments.length !== 0 ? (
          <>
            {/* SOURCE */}
            <OverviewInfo label="Source" icon={<GithubStrokeIcon />}>
              <div className="flex gap-2 items-center">
                <BranchStrokeIcon className="text-elements-low-em w-4 h-5" />
                <span className="text-elements-high-em text-sm tracking-tighter">
                  {project.deployments[0]?.branch}
                </span>
              </div>
            </OverviewInfo>

            {/* DATABASE */}
            <OverviewInfo label="Database" icon={<StorageIcon />}>
              <div className="flex gap-2 items-center">
                <Link to="#">
                  <span className="group text-controls-primary hover:border-controls-primary transition-colors border-b border-b-transparent flex gap-2 items-center text-sm tracking-tight">
                    {/* // TODO: add db name
                      dbname
                    */}
                    <LinkIcon className="group-hover:rotate-45 transition-transform" />
                  </span>
                </Link>
              </div>
            </OverviewInfo>

            {/* DEPLOYMENT */}
            <OverviewInfo label="Deployment URL" icon={<CursorBoxIcon />}>
              <div className="flex gap-2 items-center">
                <Link to="#">
                  <span className="text-controls-primary group hover:border-controls-primary transition-colors border-b border-b-transparent flex gap-2 items-center text-sm tracking-tight">
                    {liveDomain?.name}{' '}
                    <LinkIcon className="group-hover:rotate-45 transition-transform" />
                  </span>
                </Link>
              </div>
            </OverviewInfo>

            {/* DEPLOYMENT DATE */}
            <OverviewInfo label="Deployment date" icon={<CalendarDaysIcon />}>
              <div className="flex gap-2 items-center text-elements-high-em text-sm tracking-tighter">
                <span>{relativeTimeMs(project.deployments[0].createdAt)}</span>
                by
                <Avatar
                  // TODO: add imageSrc
                  // imageSrc={project.deployments[0]?.createdBy.avatar}
                  initials={getInitials(
                    project.deployments[0]?.createdBy?.name ?? '',
                  )}
                  className="rounded-full"
                  size={24}
                />
                <span>{project.deployments[0]?.createdBy?.name}</span>
              </div>
            </OverviewInfo>
          </>
        ) : (
          <p className="text-elements-low-em text-sm py-3">
            No current deployment found.
          </p>
        )}
      </div>
      <Activity activities={activities} />
    </div>
  );
};

export default OverviewTabPanel;
