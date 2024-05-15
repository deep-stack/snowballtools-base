import type { Meta, StoryObj } from '@storybook/react';
import {
  reactRouterParameters,
  withRouter,
} from 'storybook-addon-remix-react-router';

import AuthPage from 'pages/AuthPage';

const meta: Meta<typeof AuthPage> = {
  title: 'Pages/Auth/AuthPage',
  component: AuthPage,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Login: Story = {
  decorators: [withRouter],
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { userId: 'me' },
      },
      routing: {
        path: '/login',
      },
    }),
  },
};

export const SignUp: Story = {
  decorators: [withRouter],
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { userId: 'me' },
      },
      routing: {
        path: '/signup',
      },
    }),
  },
};
