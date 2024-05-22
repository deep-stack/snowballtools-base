import { Meta, StoryObj } from '@storybook/react';

import { BranchIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof BranchIcon> = {
  title: 'Icons/BranchIcon',
  component: BranchIcon,
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

type Story = StoryObj<typeof BranchIcon>;

export const Default: Story = {
  render: ({ size, name }) => <BranchIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
