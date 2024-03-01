import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { RequestError } from 'octokit';
import assert from 'assert';

import { Button, Option, Typography } from '@material-tailwind/react';

import { useOctokit } from '../../../../../context/OctokitContext';
import { useGQLClient } from '../../../../../context/GQLClientContext';
import AsyncSelect from '../../../../../components/shared/AsyncSelect';
import { Template } from '../../../../../types';
import { useToast } from 'components/shared/Toast';

const REPO_EXIST_ERROR = 'Could not clone: Name already exists on this account';

type SubmitRepoValues = {
  framework: string;
  repoName: string;
  isPrivate: boolean;
  account: string;
};

const CreateRepo = () => {
  const { octokit } = useOctokit();
  const { template } = useOutletContext<{ template: Template }>();
  const client = useGQLClient();
  const { toast, dismiss } = useToast();

  const { orgSlug } = useParams();

  const navigate = useNavigate();

  const [gitAccounts, setGitAccounts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submitRepoHandler: SubmitHandler<SubmitRepoValues> = useCallback(
    async (data) => {
      assert(data.account);
      setIsLoading(true);

      try {
        assert(template.repoFullName, 'Template URL not provided');
        const [owner, repo] = template.repoFullName.split('/');

        // TODO: Handle this functionality in backend
        const gitRepo = await octokit?.rest.repos.createUsingTemplate({
          template_owner: owner,
          template_repo: repo,
          owner: data.account,
          name: data.repoName,
          include_all_branches: false,
          private: data.isPrivate,
        });

        if (!gitRepo) {
          return;
        }

        const { addProject } = await client.addProject(orgSlug!, {
          name: `${gitRepo.data.owner!.login}-${gitRepo.data.name}`,
          prodBranch: gitRepo.data.default_branch ?? 'main',
          repository: gitRepo.data.full_name,
          // TODO: Set selected template
          template: 'webapp',
        });

        navigate(`deploy?projectId=${addProject.id}&templateId=${template.id}`);
      } catch (err) {
        setIsLoading(false);

        if (
          err instanceof RequestError &&
          err.message.includes(REPO_EXIST_ERROR)
        ) {
          toast({
            id: 'repo-exist-error',
            title: 'Could not create: repository already exists',
            variant: 'error',
            onDismiss: dismiss,
          });

          return;
        }

        console.error(err);
        toast({
          id: 'error-deploying-project',
          title: 'Error deploying project',
          variant: 'error',
          onDismiss: dismiss,
        });
      }
    },
    [octokit],
  );

  useEffect(() => {
    const fetchUserAndOrgs = async () => {
      const user = await octokit?.rest.users.getAuthenticated();
      const orgs = await octokit?.rest.orgs.listForAuthenticatedUser();

      if (user && orgs) {
        const orgsLoginArr = orgs.data.map((org) => org.login);

        setGitAccounts([user.data.login, ...orgsLoginArr]);
      }
    };

    fetchUserAndOrgs();
  }, [octokit]);

  const { register, handleSubmit, control, reset } = useForm<SubmitRepoValues>({
    defaultValues: {
      framework: 'React',
      repoName: '',
      isPrivate: false,
      account: gitAccounts[0],
    },
  });

  useEffect(() => {
    if (gitAccounts.length > 0) {
      reset({ account: gitAccounts[0] });
    }
  }, [gitAccounts]);

  return (
    <form onSubmit={handleSubmit(submitRepoHandler)}>
      <div className="mb-2">
        <Typography variant="h6" placeholder={''}>
          Create a repository
        </Typography>
        <Typography color="gray" placeholder={''}>
          The project will be cloned into this repository
        </Typography>
      </div>
      <div className="mb-2">
        <h5>Framework</h5>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center w-1/2 border rounded-lg p-2">
            <input
              type="radio"
              {...register('framework')}
              value="React"
              className="h-5 w-5 text-indigo-600 rounded"
            />
            <span className="ml-2">^React</span>
          </label>
          <label className="inline-flex items-center w-1/2 border rounded-lg p-2">
            <input
              type="radio"
              {...register('framework')}
              className="h-5 w-5 text-indigo-600 rounded"
              value="Next"
            />
            <span className="ml-2">^Next</span>
          </label>
        </div>
      </div>
      <div className="mb-2">
        <h5>Git account</h5>
        <div>
          <Controller
            name="account"
            control={control}
            render={({ field }) => (
              <AsyncSelect {...field}>
                {gitAccounts.map((account, key) => (
                  <Option key={key} value={account}>
                    ^ {account}
                  </Option>
                ))}
              </AsyncSelect>
            )}
          />
        </div>
      </div>
      <div className="mb-2">
        <h5>Name the repo</h5>
        <div>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full focus:border-blue-300 focus:outline-none focus:shadow-outline-blue"
            placeholder=""
            {...register('repoName')}
          />
        </div>
      </div>
      <div className="mb-2">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="h-5 w-5 text-indigo-600 rounded"
            {...register('isPrivate')}
          />
          <span className="ml-2">Make this repo private</span>
        </label>
      </div>
      <div className="mb-2">
        <Button
          className="bg-blue-500 rounded-xl p-2"
          type="submit"
          disabled={!Boolean(template.repoFullName) || isLoading}
          loading={isLoading}
          placeholder={''}
        >
          Deploy ^
        </Button>
      </div>
    </form>
  );
};

export default CreateRepo;
