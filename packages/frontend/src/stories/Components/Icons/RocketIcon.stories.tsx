import { Meta, StoryObj } from '@storybook/react';

import { RocketIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof RocketIcon> = {
  title: 'Icons/RocketIcon',
  component: RocketIcon,
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

type Story = StoryObj<typeof RocketIcon>;

export const Default: Story = {
  render: ({ size, name }) => <RocketIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
