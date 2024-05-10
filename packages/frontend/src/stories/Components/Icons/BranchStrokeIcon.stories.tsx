import { Meta, StoryObj } from '@storybook/react';

import { BranchStrokeIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof BranchStrokeIcon> = {
  title: 'Icons/BranchStrokeIcon',
  component: BranchStrokeIcon,
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

type Story = StoryObj<typeof BranchStrokeIcon>;

export const Default: Story = {
  render: ({ size, name }) => <BranchStrokeIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
