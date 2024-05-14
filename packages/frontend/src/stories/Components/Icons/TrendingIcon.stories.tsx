import { Meta, StoryObj } from '@storybook/react';

import { TrendingIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof TrendingIcon> = {
  title: 'Icons/TrendingIcon',
  component: TrendingIcon,
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

type Story = StoryObj<typeof TrendingIcon>;

export const Default: Story = {
  render: ({ size, name }) => <TrendingIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
