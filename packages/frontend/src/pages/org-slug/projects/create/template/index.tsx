import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import assert from 'assert';

import { Option, Typography } from '@material-tailwind/react';

import { useOctokit } from '../../../../../context/OctokitContext';
import { useGQLClient } from '../../../../../context/GQLClientContext';
import AsyncSelect from '../../../../../components/shared/AsyncSelect';

type SubmitRepoValues = {
  framework: string;
  repoName: string;
  isPrivate: boolean;
  account: string;
};

const CreateRepo = () => {
  const { octokit } = useOctokit();

  const client = useGQLClient();

  const { orgSlug } = useParams();

  const navigate = useNavigate();

  const [gitAccounts, setGitAccounts] = useState<string[]>([]);

  const submitRepoHandler: SubmitHandler<SubmitRepoValues> = useCallback(
    async (data) => {
      assert(data.account);

      try {
        // TODO: Handle this functionality in backend
        const gitRepo = await octokit?.rest.repos.createUsingTemplate({
          template_owner: 'github-rest',
          template_repo: 'test-progressive-web-app',
          owner: data.account,
          name: data.repoName,
          description: 'This is your first repository',
          include_all_branches: false,
          private: data.isPrivate,
        });

        if (!gitRepo) {
          return;
        }

        const { addProject } = await client.addProject(orgSlug!, {
          name: `${gitRepo.data.owner!.login}-${gitRepo.data.name}`,
          // TODO: Get organization id from context or URL
          prodBranch: gitRepo.data.default_branch ?? 'main',
          repository: gitRepo.data.full_name,
        });

        navigate(
          `/${orgSlug}/projects/create/template/deploy?projectId=${addProject.id}`,
        );
      } catch (err) {
        toast.error('Error deploying project');
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

  // TODO: Get users and orgs from GitHub

  return (
    <form onSubmit={handleSubmit(submitRepoHandler)}>
      <div className="mb-2">
        <Typography variant="h6">Create a repository</Typography>
        <Typography color="gray">
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
              <AsyncSelect
                {...field}
                label={!field.value ? 'Select an account / Organization' : ''}
              >
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
        <button className="bg-blue-500 rounded-xl p-2" type="submit">
          Deploy ^
        </button>
      </div>
    </form>
  );
};

export default CreateRepo;
