import { Meta, StoryObj } from '@storybook/react';

import { ChevronGrabberHorizontal } from 'components/shared/CustomIcon';

const meta: Meta<typeof ChevronGrabberHorizontal> = {
  title: 'Icons/ChevronGrabberHorizontal',
  component: ChevronGrabberHorizontal,
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

type Story = StoryObj<typeof ChevronGrabberHorizontal>;

export const Default: Story = {
  render: ({ size, name }) => (
    <ChevronGrabberHorizontal size={size} name={name} />
  ),
  args: {
    size: '24px',
    name: 'plus',
  },
};
