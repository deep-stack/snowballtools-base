import { Meta, StoryObj } from '@storybook/react';

import { RefreshIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof RefreshIcon> = {
  title: 'Icons/RefreshIcon',
  component: RefreshIcon,
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

type Story = StoryObj<typeof RefreshIcon>;

export const Default: Story = {
  render: ({ size, name }) => <RefreshIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
