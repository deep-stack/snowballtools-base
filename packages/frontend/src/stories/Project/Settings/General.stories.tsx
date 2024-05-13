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
        path: '/snowball-tools-1/projects/6bb3bec2-d71b-4fc0-9e32-4767f68668f4/settings',
      },
    }),
  },
} as Meta<typeof AddEnvironmentVariableRow>;

export default meta;

type Story = StoryObj<typeof AddEnvironmentVariableRow>;

export const Default: Story = {};
