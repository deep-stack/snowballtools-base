import { Meta, StoryObj } from '@storybook/react';

import { CommitIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CommitIcon> = {
  title: 'Icons/CommitIcon',
  component: CommitIcon,
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

type Story = StoryObj<typeof CommitIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CommitIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
