import { useCallback, useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import assert from 'assert';
import { useMediaQuery } from 'usehooks-ts';
import { RequestError } from 'octokit';

import { useOctokit } from '../../../../../context/OctokitContext';
import { Template } from '../../../../../types/types';
import { Heading } from 'components/shared/Heading';
import { Input } from 'components/shared/Input';
import { Select, SelectOption } from 'components/shared/Select';
import {
  ArrowRightCircleFilledIcon,
  LoadingIcon,
} from 'components/shared/CustomIcon';
import { Button } from 'components/shared/Button';
import { useToast } from 'components/shared/Toast';

const REPO_EXIST_ERROR = 'Could not clone: Name already exists on this account';

type SubmitRepoValues = {
  framework: string;
  repoName: string;
  isPrivate: boolean;
  account: string;
};

const CreateRepo = () => {
  const { octokit, isAuth } = useOctokit();
  const { template } = useOutletContext<{ template: Template }>();

  const { orgSlug } = useParams();
  const { toast, dismiss } = useToast();

  const isTabletView = useMediaQuery('(min-width: 720px)'); // md:
  const buttonSize = isTabletView ? { size: 'lg' as const } : {};

  const navigate = useNavigate();

  const [gitAccounts, setGitAccounts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkRepoExists = async (account: string, repoName: string) => {
    try {
      await octokit.rest.repos.get({ owner: account, repo: repoName });
      return true;
    } catch (error) {
      // Error handled by octokit error hook interceptor in Octokit context
      console.error(error);
      return;
    }
  };

  const submitRepoHandler: SubmitHandler<SubmitRepoValues> = useCallback(
    async (data) => {
      assert(data.account);
      setIsLoading(true);

      try {
        assert(template.repoFullName, 'Template URL not provided');
        const [owner, repo] = template.repoFullName.split('/');

        const repoExists = await checkRepoExists(data.account, data.repoName);
        if (repoExists) {
          toast({
            id: 'repo-exist-error',
            title: 'Repository already exists with this name',
            variant: 'warning',
            onDismiss: dismiss,
          });
          setIsLoading(false);
          return;
        }

        setIsLoading(true);

        navigate(
          `configure?templateId=${template.id}&templateOwner=${owner}&templateRepo=${repo}&owner=${data.account}&name=${data.repoName}&isPrivate=false&orgSlug=${orgSlug}`,
        );
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

        console.error((err as Error).message);
        toast({
          id: 'error-deploying-project',
          title: 'Error deploying project',
          variant: 'error',
          onDismiss: dismiss,
        });
      }
    },
    [octokit, toast],
  );

  useEffect(() => {
    const fetchUserAndOrgs = async () => {
      try {
        const user = await octokit?.rest.users.getAuthenticated();
        const orgs = await octokit?.rest.orgs.listForAuthenticatedUser();

        if (user && orgs) {
          const orgsLoginArr = orgs.data.map((org) => org.login);

          setGitAccounts([user.data.login, ...orgsLoginArr]);
        }
      } catch (error) {
        // Error handled by octokit error hook interceptor in Octokit context
        console.error(error);
        return;
      }
    };

    if (isAuth) {
      fetchUserAndOrgs();
    }
  }, [octokit, isAuth]);

  const { handleSubmit, control, reset } = useForm<SubmitRepoValues>({
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
      <div className="flex flex-col gap-4 lg:gap-7 w-full">
        <div>
          <Heading as="h3" className="text-lg font-medium">
            Create a repository
          </Heading>
          <Heading as="h5" className="text-sm font-sans text-elements-low-em">
            The project will be cloned into this repository
          </Heading>
        </div>

        <div className="flex flex-col justify-start gap-3">
          <span className="text-sm text-elements-high-em">Git account</span>
          {gitAccounts.length > 0 ? (
            <Controller
              name="account"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={{ value } as SelectOption}
                  onChange={(value) => onChange((value as SelectOption).value)}
                  options={
                    gitAccounts.map((account) => ({
                      value: account,
                      label: account,
                    })) ?? []
                  }
                />
              )}
            />
          ) : (
            <Select options={[]} disabled />
          )}
        </div>
        <div className="flex flex-col justify-start gap-3">
          <span className="text-sm text-elements-high-em">Name the repo</span>
          <Controller
            name="repoName"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Input value={value} onChange={onChange} />
            )}
          />
        </div>
        <div>
          <Button
            {...buttonSize}
            type="submit"
            disabled={!Boolean(template.repoFullName) || isLoading}
            rightIcon={
              isLoading ? (
                <LoadingIcon className="animate-spin" />
              ) : (
                <ArrowRightCircleFilledIcon />
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateRepo;
