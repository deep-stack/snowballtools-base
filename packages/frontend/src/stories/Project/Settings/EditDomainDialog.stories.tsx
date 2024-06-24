import { StoryObj, Meta } from '@storybook/react';

import EditDomainDialog from 'components/projects/project/settings/EditDomainDialog';

const meta: Meta<typeof EditDomainDialog> = {
  title: 'Components/EditDomainDialog',
  component: EditDomainDialog,
  tags: ['autodocs'],
  argTypes: {
    domains: {
      control: {
        type: 'object',
      },
    },
    open: {
      control: {
        type: 'boolean',
      },
    },
    handleOpen: {
      action: 'open',
    },
    domain: {
      control: {
        type: 'object',
      },
    },
    branches: {
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

type Story = StoryObj<typeof EditDomainDialog>;

export const Default: Story = {};
