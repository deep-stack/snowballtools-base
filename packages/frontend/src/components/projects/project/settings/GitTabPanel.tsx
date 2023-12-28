import React, { useState } from 'react';

import { Button, Input, Switch, Typography } from '@material-tailwind/react';

import RepositoryList from '../../create/RepositoryList';
import RepoConnectedSection from './RepoConnectedSection';
import GitSelectionSection from './GitSelectionSection';
import { GitSelect, RepositoryDetails } from '../../../../types/project';

const GitTabPanel = () => {
  const [gitSelect, setGitSelect] = useState('none');
  const [linkedRepo, setLinkedRepo] = useState<RepositoryDetails>();

  const gitSelectionHandler = (git: GitSelect) => {
    setGitSelect(git);
  };

  const repoSelectionHandler = (repoDetails: RepositoryDetails) => {
    setLinkedRepo(repoDetails);
  };

  return (
    <>
      <div className="mb-2 p-2">
        <Typography variant="h6" className="text-black">
          Connect Git repository
        </Typography>
        <Typography variant="small">
          Create deployments for any commits pushed to your Git repository.
        </Typography>
        {linkedRepo && <RepoConnectedSection linkedRepo={linkedRepo} />}
        {!linkedRepo &&
          (GitSelect.NONE === gitSelect ? (
            <GitSelectionSection gitSelectionHandler={gitSelectionHandler} />
          ) : (
            <RepositoryList repoSelectionHandler={repoSelectionHandler} />
          ))}

        <div className="flex justify-between mt-4">
          <div>
            <Typography variant="small">Pull request comments</Typography>
          </div>
          <div>
            <Switch crossOrigin={undefined} defaultChecked />
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <Typography variant="small">Commit comments</Typography>
          </div>
          <div>
            <Switch crossOrigin={undefined} />
          </div>
        </div>
      </div>

      <div className="mb-2 p-2">
        <Typography variant="h6" className="text-black">
          Production branch
        </Typography>
        <Typography variant="small">
          By default, each commit pushed to the{' '}
          <span className="font-bold">main</span> branch initiates a production
          deployment. You can opt for a different branch for deployment in the
          settings.
        </Typography>
        {!linkedRepo && (
          <div className="flex bg-blue-100 gap-4 rounded-lg p-2">
            <div>^</div>
            <div>
              <Typography variant="small">
                This project isn&apos;t currently linked to a Git repository. To
                establish a production branch, please linked to an existing Git
                repository in the &apos;Connected Git Repository&apos; section
                above.
              </Typography>
            </div>
          </div>
        )}
        <Typography variant="small">Branch name</Typography>
        <Input crossOrigin={undefined} disabled value="main" />
        <Button size="sm" disabled className="mt-1">
          Save
        </Button>
      </div>

      <div className="mb-2 p-2">
        <Typography variant="h6" className="text-black">
          Deploy webhooks
        </Typography>
        <Typography variant="small">
          Webhooks configured to trigger when there is a change in a
          project&apos;s build or deployment status.
        </Typography>
        <div className="flex gap-1">
          <div className="grow">
            <Typography variant="small">Webhook URL</Typography>
            <Input crossOrigin={undefined} />
          </div>
          <div className="self-end">
            <Button size="sm" disabled>
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GitTabPanel;
