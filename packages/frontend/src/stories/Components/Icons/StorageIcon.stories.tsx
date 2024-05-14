import { Meta, StoryObj } from '@storybook/react';

import { StorageIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof StorageIcon> = {
  title: 'Icons/StorageIcon',
  component: StorageIcon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'text',
    },
    name: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof StorageIcon>;

export const Default: Story = {
  render: ({ size, name }) => <StorageIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
