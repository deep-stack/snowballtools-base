import { Meta, StoryObj } from '@storybook/react';

import AddMemberDialog from 'components/projects/project/settings/AddMemberDialog';

const meta: Meta<typeof AddMemberDialog> = {
  title: 'Project/Settings/AddMemberDialog',
  component: AddMemberDialog,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: {
        type: 'boolean',
      },
    },
    handleOpen: {
      action: 'open',
    },
    handleAddMember: {
      action: 'addMember',
    },
  },
  args: {
    open: true,
  },
};

export default meta;

type Story = StoryObj<typeof AddMemberDialog>;

export const Default: Story = {};
