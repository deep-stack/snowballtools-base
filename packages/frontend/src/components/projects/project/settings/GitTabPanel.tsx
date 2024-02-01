import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Project } from 'gql-client';

import { Button, Input, Switch, Typography } from '@material-tailwind/react';

import WebhookCard from './WebhookCard';
import { useGQLClient } from '../../../../context/GQLClientContext';

const GitTabPanel = ({
  project,
  onUpdate,
}: {
  project: Project;
  onUpdate: () => Promise<void>;
}) => {
  const client = useGQLClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      webhookUrl: project?.webhooks,
    },
  });

  const {
    register: registerProdBranch,
    handleSubmit: handleSubmitProdBranch,
    reset: resetProdBranch,
  } = useForm({
    defaultValues: {
      prodBranch: project?.prodBranch,
    },
  });

  const updateProdBranchHandler = useCallback(
    async (data: any) => {
      console.log('updateProdBranchHandler', data);
      const { updateProdBranch } = await client.updateProdBranch(
        project.id,
        data.prodBranch,
      );

      if (updateProdBranch) {
        onUpdate();
        toast.success('Production branch upadated successfully');
      } else {
        toast.error('Error updating production branch');
      }
    },
    [project],
  );

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  useEffect(() => {
    resetProdBranch({
      prodBranch: project?.prodBranch,
    });
  }, [project]);

  const handleDelete = (index: number) => {
    return index;
  };

  return (
    <>
      <div className="mb-2 p-2">
        <Typography variant="h6" className="text-black">
          Git repository
        </Typography>

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

      <form onSubmit={handleSubmitProdBranch(updateProdBranchHandler)}>
        <div className="mb-2 p-2">
          <Typography variant="h6" className="text-black">
            Production branch
          </Typography>
          <Typography variant="small">
            By default, each commit pushed to the{' '}
            <span className="font-bold">{project.prodBranch}</span> branch
            initiates a production deployment. You can opt for a different
            branch for deployment in the settings.
          </Typography>
          <Typography variant="small">Branch name</Typography>
          <Input
            crossOrigin={undefined}
            {...registerProdBranch('prodBranch')}
          />
          <Button size="sm" className="mt-1" type="submit">
            Save
          </Button>
        </div>
      </form>

      <form
        onSubmit={handleSubmit(() => {
          toast.success('Webhook added successfully.');
        })}
      >
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
              <Input crossOrigin={undefined} {...register('webhookUrl')} />
            </div>
            <div className="self-end">
              <Button size="sm" type="submit">
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
      <div className="mb-2 p-2">
        {project?.webhooks?.map((webhookUrl, index) => {
          return (
            <WebhookCard
              webhooksArray={project.webhooks}
              webhookUrl={webhookUrl}
              handleDelete={() => handleDelete(index)}
              key={index}
            />
          );
        })}
      </div>
    </>
  );
};

export default GitTabPanel;
