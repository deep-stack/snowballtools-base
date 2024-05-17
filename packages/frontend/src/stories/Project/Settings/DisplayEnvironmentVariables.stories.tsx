import { Meta, StoryObj } from '@storybook/react';

import DisplayEnvironmentVariables from 'components/projects/project/settings/DisplayEnvironmentVariables';

const meta: Meta<typeof DisplayEnvironmentVariables> = {
  title: 'Project/Settings/DisplayEnvironmentVariables',
  component: DisplayEnvironmentVariables,
  argTypes: {
    environment: {
      control: {
        type: 'object',
      },
    },
    variables: {
      control: {
        type: 'object',
      },
    },
    onUpdate: {
      action: 'update',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DisplayEnvironmentVariables>;

export const Default: Story = {};
