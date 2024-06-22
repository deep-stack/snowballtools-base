import { Meta, StoryObj } from '@storybook/react';

import { ChevronUpDown } from 'components/shared/CustomIcon';

const meta: Meta<typeof ChevronUpDown> = {
  title: 'Icons/ChevronUpDown',
  component: ChevronUpDown,
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

type Story = StoryObj<typeof ChevronUpDown>;

export const Default: Story = {
  render: ({ size, name }) => <ChevronUpDown size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
