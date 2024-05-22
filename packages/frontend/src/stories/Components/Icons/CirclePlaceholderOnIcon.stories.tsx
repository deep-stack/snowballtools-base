import { Meta, StoryObj } from '@storybook/react';

import { CirclePlaceholderOnIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CirclePlaceholderOnIcon> = {
  title: 'Icons/CirclePlaceholderOnIcon',
  component: CirclePlaceholderOnIcon,
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

type Story = StoryObj<typeof CirclePlaceholderOnIcon>;

export const Default: Story = {
  render: ({ size, name }) => (
    <CirclePlaceholderOnIcon size={size} name={name} />
  ),
  args: {
    size: '24px',
    name: 'plus',
  },
};
