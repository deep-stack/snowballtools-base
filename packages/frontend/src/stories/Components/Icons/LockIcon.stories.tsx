import { Meta, StoryObj } from '@storybook/react';

import { LockIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof LockIcon> = {
  title: 'Icons/LockIcon',
  component: LockIcon,
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

type Story = StoryObj<typeof LockIcon>;

export const Default: Story = {
  render: ({ size, name }) => <LockIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
