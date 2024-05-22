import { Meta, StoryObj } from '@storybook/react';

import EditEnvironmentVariableRow from 'components/projects/project/settings/EditEnvironmentVariableRow';
import { environmentVariable0 } from '../../MockStoriesData';

const meta: Meta<typeof EditEnvironmentVariableRow> = {
  title: 'Project/Settings/EditEnvironmentVariableRow',
  component: EditEnvironmentVariableRow,
  argTypes: {
    variable: {
      control: {
        type: 'object',
      },
    },
    onUpdate: {
      action: 'update',
    },
  },
  args: {
    variable: environmentVariable0,
  },
};

export default meta;

type Story = StoryObj<typeof EditEnvironmentVariableRow>;

export const Default: Story = {};
