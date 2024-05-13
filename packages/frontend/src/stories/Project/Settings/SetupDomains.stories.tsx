import { Meta, StoryObj } from '@storybook/react';

import SetupDomain from 'components/projects/project/settings/SetupDomain';
import {
  reactRouterParameters,
  withRouter,
} from 'storybook-addon-remix-react-router';

const meta: Meta<typeof SetupDomain> = {
  title: 'Project/Settings/SetupDomain',
  component: SetupDomain,
  tags: ['autodocs'],
  decorators: [withRouter],
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { userId: 'me' },
      },
      routing: {
        path: '/snowball-tools-1/projects/6bb3bec2-d71b-4fc0-9e32-4767f68668f4/settings/domains/add',
      },
    }),
  },
} as Meta<typeof SetupDomain>;

export default meta;

type Story = StoryObj<typeof SetupDomain>;

export const Default: Story = {};
