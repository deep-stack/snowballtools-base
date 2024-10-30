import { Meta, StoryObj } from '@storybook/react';
import {
  reactRouterParameters,
  withRouter,
} from 'storybook-addon-remix-react-router';

import DeleteProjectDialog from 'components/projects/project/settings/DeleteProjectDialog';
import { project } from '../../MockStoriesData';

const meta: Meta<typeof DeleteProjectDialog> = {
  title: 'Project/Settings/DeleteProjectDialog',
  component: DeleteProjectDialog,
  tags: ['autodocs'],
  decorators: [withRouter],
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { userId: 'me' },
      },
      routing: {
        path: '/deploy-tools/projects/6bb3bec2-d71b-4fc0-9e32-4767f68668f4/settings',
      },
    }),
  },
  argTypes: {
    open: {
      control: {
        type: 'boolean',
      },
    },
    handleOpen: {
      action: 'open',
    },
    project: {
      control: {
        type: 'object',
      },
    },
  },
  args: {
    open: true,
    project: project,
  },
};

export default meta;

type Story = StoryObj<typeof DeleteProjectDialog>;

export const Default: Story = {};
