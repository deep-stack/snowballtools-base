import { Meta, StoryObj } from '@storybook/react';

import { AppleIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof AppleIcon> = {
  title: 'Icons/AppleIcon',
  component: AppleIcon,
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

type Story = StoryObj<typeof AppleIcon>;

export const Default: Story = {
  render: ({ size, name }) => <AppleIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
