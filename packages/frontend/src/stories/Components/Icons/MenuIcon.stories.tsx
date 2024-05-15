import { Meta, StoryObj } from '@storybook/react';

import { MenuIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof MenuIcon> = {
  title: 'Icons/MenuIcon',
  component: MenuIcon,
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

type Story = StoryObj<typeof MenuIcon>;

export const Default: Story = {
  render: ({ size, name }) => <MenuIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
