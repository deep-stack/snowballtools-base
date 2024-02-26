import React, { useCallback, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button, Input, Switch, Typography } from '@material-tailwind/react';

import WebhookCard from '../../../../../components/projects/project/settings/WebhookCard';
import { useGQLClient } from '../../../../../context/GQLClientContext';
import { OutletContextType } from '../../../../../types';

type UpdateProdBranchValues = {
  prodBranch: string;
};

type UpdateWebhooksValues = {
  webhookUrl: string;
};

const GitTabPanel = () => {
  const client = useGQLClient();
  const { project, onUpdate } = useOutletContext<OutletContextType>();

  const {
    register: registerProdBranch,
    handleSubmit: handleSubmitProdBranch,
    reset: resetProdBranch,
  } = useForm({
    defaultValues: {
      prodBranch: project.prodBranch,
    },
  });

  const updateProdBranchHandler: SubmitHandler<UpdateProdBranchValues> =
    useCallback(
      async (data) => {
        const { updateProject } = await client.updateProject(project.id, {
          prodBranch: data.prodBranch,
        });

        if (updateProject) {
          await onUpdate();
          toast.success('Production branch upadated successfully');
        } else {
          toast.error('Error updating production branch');
        }
      },
      [project],
    );

  const {
    register: registerWebhooks,
    handleSubmit: handleSubmitWebhooks,
    reset: resetWebhooks,
  } = useForm({
    defaultValues: {
      webhookUrl: '',
    },
  });

  const updateWebhooksHandler: SubmitHandler<UpdateWebhooksValues> =
    useCallback(
      async (data) => {
        const { updateProject } = await client.updateProject(project.id, {
          webhooks: [...project.webhooks, data.webhookUrl],
        });

        if (updateProject) {
          await onUpdate();
          toast.success('Webhook added successfully');
        } else {
          toast.error('Error adding webhook');
        }

        resetWebhooks();
      },
      [project],
    );

  useEffect(() => {
    resetProdBranch({
      prodBranch: project.prodBranch,
    });
  }, [project]);

  const handleDeleteWebhook = async (index: number) => {
    project.webhooks.splice(index, 1);
    const { updateProject } = await client.updateProject(project.id, {
      webhooks: project.webhooks,
    });

    if (updateProject) {
      await onUpdate();
      toast.success('Webhook deleted successfully');
    } else {
      toast.error('Error deleting webhook');
    }
  };

  return (
    <>
      <div className="mb-2 p-2">
        <Typography variant="h6" className="text-black" placeholder={''}>
          Git repository
        </Typography>

        <div className="flex justify-between mt-4">
          <div>
            <Typography variant="small" placeholder={''}>
              Pull request comments
            </Typography>
          </div>
          <div>
            <Switch crossOrigin={undefined} defaultChecked />
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <Typography variant="small" placeholder={''}>
              Commit comments
            </Typography>
          </div>
          <div>
            <Switch crossOrigin={undefined} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitProdBranch(updateProdBranchHandler)}>
        <div className="mb-2 p-2">
          <Typography variant="h6" className="text-black" placeholder={''}>
            Production branch
          </Typography>
          <Typography variant="small" placeholder={''}>
            By default, each commit pushed to the{' '}
            <span className="font-bold">{project.prodBranch}</span> branch
            initiates a production deployment. You can opt for a different
            branch for deployment in the settings.
          </Typography>
          <Typography variant="small" placeholder={''}>
            Branch name
          </Typography>
          <Input
            crossOrigin={undefined}
            {...registerProdBranch('prodBranch')}
          />
          <Button size="sm" className="mt-1" type="submit" placeholder={''}>
            Save
          </Button>
        </div>
      </form>

      <form onSubmit={handleSubmitWebhooks(updateWebhooksHandler)}>
        <div className="mb-2 p-2">
          <Typography variant="h6" className="text-black" placeholder={''}>
            Deploy webhooks
          </Typography>
          <Typography variant="small" placeholder={''}>
            Webhooks configured to trigger when there is a change in a
            project&apos;s build or deployment status.
          </Typography>
          <div className="flex gap-1">
            <div className="grow">
              <Typography variant="small" placeholder={''}>
                Webhook URL
              </Typography>
              <Input
                crossOrigin={undefined}
                {...registerWebhooks('webhookUrl')}
              />
            </div>
            <div className="self-end">
              <Button size="sm" type="submit" placeholder={''}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
      <div className="mb-2 p-2">
        {project.webhooks.map((webhookUrl, index) => {
          return (
            <WebhookCard
              webhookUrl={webhookUrl}
              onDelete={() => handleDeleteWebhook(index)}
              key={index}
            />
          );
        })}
      </div>
    </>
  );
};

export default GitTabPanel;
