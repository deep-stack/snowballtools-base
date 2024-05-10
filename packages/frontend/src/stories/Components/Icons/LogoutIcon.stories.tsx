import { Meta, StoryObj } from '@storybook/react';

import { LogoutIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof LogoutIcon> = {
  title: 'Icons/LogoutIcon',
  component: LogoutIcon,
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

type Story = StoryObj<typeof LogoutIcon>;

export const Default: Story = {
  render: ({ size, name }) => <LogoutIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
