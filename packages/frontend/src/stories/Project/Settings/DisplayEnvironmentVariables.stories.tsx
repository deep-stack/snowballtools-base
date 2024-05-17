import { Meta, StoryObj } from '@storybook/react';

import DisplayEnvironmentVariables from 'components/projects/project/settings/DisplayEnvironmentVariables';
import {
  environmentVariable0,
  environmentVariable1,
} from '../../MockStoriesData';
import { Environment } from 'gql-client';

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
  args: {
    environment: Environment.Development,
    variables: [environmentVariable0, environmentVariable1],
  },
};

export default meta;

type Story = StoryObj<typeof DisplayEnvironmentVariables>;

export const Default: Story = {};
