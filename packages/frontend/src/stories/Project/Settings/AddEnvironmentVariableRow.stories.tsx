import { Meta, StoryObj } from '@storybook/react';
import {
  reactRouterParameters,
  withRouter,
} from 'storybook-addon-remix-react-router';

import AddEnvironmentVariableRow from 'components/projects/project/settings/AddEnvironmentVariableRow';

const meta: Meta<typeof AddEnvironmentVariableRow> = {
  title: 'Project/Settings/AddEnvironmentVariableRow',
  component: AddEnvironmentVariableRow,
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
    onDelete: {
      action: 'delete',
    },
    register: {
      action: 'register',
    },
    index: {
      type: 'number',
    },
    isDeleteDisabled: {
      type: 'boolean',
    },
  },
  args: {
    isDeleteDisabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof AddEnvironmentVariableRow>;

export const Default: Story = {};

export const DisabledDelete: Story = {
  args: {
    isDeleteDisabled: true,
  },
};

export const First: Story = {
  args: {
    index: 0,
  },
};

export const Second: Story = {
  args: {
    index: 1,
  },
};
