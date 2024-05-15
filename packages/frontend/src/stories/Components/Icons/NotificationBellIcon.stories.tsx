import { Meta, StoryObj } from '@storybook/react';

import { NotificationBellIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof NotificationBellIcon> = {
  title: 'Icons/NotificationBellIcon',
  component: NotificationBellIcon,
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

type Story = StoryObj<typeof NotificationBellIcon>;

export const Default: Story = {
  render: ({ size, name }) => <NotificationBellIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
