import { Meta, StoryObj } from '@storybook/react';
import {
  reactRouterParameters,
  withRouter,
} from 'storybook-addon-remix-react-router';

import Config from '../../../pages/org-slug/projects/id/settings/domains/add/Config';

const meta: Meta<typeof Config> = {
  title: 'Project/Settings/Config',
  component: Config,
  tags: ['autodocs'],
  decorators: [withRouter],
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { userId: 'me' },
      },
      routing: {
        path: '/deploy-tools/projects/6bb3bec2-d71b-4fc0-9e32-4767f68668f4/settings/domains/add/config',
      },
    }),
  },
} as Meta<typeof Config>;

export default meta;

type Story = StoryObj<typeof Config>;

export const Default: Story = {};
