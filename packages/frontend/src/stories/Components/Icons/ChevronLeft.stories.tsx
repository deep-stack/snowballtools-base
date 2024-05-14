import { Meta, StoryObj } from '@storybook/react';

import { ChevronLeft } from 'components/shared/CustomIcon';

const meta: Meta<typeof ChevronLeft> = {
  title: 'Icons/ChevronLeft',
  component: ChevronLeft,
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

type Story = StoryObj<typeof ChevronLeft>;

export const Default: Story = {
  render: ({ size, name }) => <ChevronLeft size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
