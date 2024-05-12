import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import WebhookCard from 'components/projects/project/settings/WebhookCard';
import { useGQLClient } from '../../../../../context/GQLClientContext';
import { OutletContextType } from '../../../../../types';
import { Button } from 'components/shared/Button';
import { Input } from 'components/shared/Input';
import { Switch } from 'components/shared/Switch';
import { Heading } from 'components/shared/Heading';
import { useToast } from 'components/shared/Toast';

type UpdateProdBranchValues = {
  prodBranch: string;
};

type UpdateWebhooksValues = {
  webhookUrl: string;
};

const GitTabPanel = () => {
  const client = useGQLClient();
  const { toast } = useToast();
  const { project, onUpdate } = useOutletContext<OutletContextType>();

  const [pullRequestComments, updatePullRequestComments] = useState(true);
  const [commitComments, updateCommitComments] = useState(false);

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
          toast({
            id: 'prod_branch_updated',
            title: 'Production branch updated successfully',
            variant: 'success',
            onDismiss() {},
          });
        } else {
          toast({
            id: 'prod_branch_update_failed',
            title: 'Error updating production branch',
            variant: 'error',
            onDismiss() {},
          });
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
          toast({
            id: 'webhook_added',
            title: 'Webhook added successfully',
            variant: 'success',
            onDismiss() {},
          });
        } else {
          toast({
            id: 'webhook_add_failed',
            title: 'Error adding webhook',
            variant: 'error',
            onDismiss() {},
          });
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
      toast({
        id: 'webhook_deleted',
        title: 'Webhook deleted successfully',
        variant: 'success',
        onDismiss() {},
      });
    } else {
      toast({
        id: 'webhook_delete_failed',
        title: 'Error deleting webhook',
        variant: 'error',
        onDismiss() {},
      });
    }
  };

  return (
    <div className="flex-col justify-start items-start gap-6 inline-flex">
      <div className="self-stretch space-y-3 px-2">
        <Heading className="text-sky-950 text-lg font-medium leading-normal">
          Git repository
        </Heading>

        <div className="flex justify-between mt-4">
          <div>
            <p className="text-slate-600 text-sm font-normal leading-tight">
              Pull request comments
            </p>
          </div>
          <div>
            <Switch
              checked={pullRequestComments}
              onChange={() => updatePullRequestComments(!pullRequestComments)}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-slate-600 text-sm font-normal leading-tight">
              Commit comments
            </p>
          </div>
          <div>
            <Switch
              checked={commitComments}
              onChange={() => updateCommitComments(!commitComments)}
            />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmitProdBranch(updateProdBranchHandler)}
        className="space-y-3 px-2"
      >
        <Heading className="text-sky-950 text-lg font-medium leading-normal">
          Production branch
        </Heading>
        <p className="text-slate-600 text-sm font-normal leading-tight">
          By default, each commit pushed to the{' '}
          <span className="font-bold">{project.prodBranch}</span> branch
          initiates a production deployment. You can opt for a different branch
          for deployment in the settings.
        </p>
        <p className="text-slate-600 text-sm font-normal leading-tight">
          Branch name
        </p>
        <Input {...registerProdBranch('prodBranch')} />
        <Button size="md" variant="primary">
          Save
        </Button>
      </form>

      <form
        onSubmit={handleSubmitWebhooks(updateWebhooksHandler)}
        className="space-y-3 px-2"
      >
        <Heading className="text-sky-950 text-lg font-medium leading-normal">
          Deploy webhooks
        </Heading>
        <p className="text-slate-600 text-sm font-normal leading-tight">
          {' '}
          Webhooks configured to trigger when there is a change in a
          project&apos;s build or deployment status.
        </p>
        <div className="flex gap-1">
          <div className="grow">
            <p className="text-slate-600 text-sm font-normal leading-tight">
              Webhook URL
            </p>
            <Input {...registerWebhooks('webhookUrl')} />
          </div>
          <div className="self-end">
            <Button size="sm" type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
      <div className="space-y-3 px-2">
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
    </div>
  );
};

export default GitTabPanel;
