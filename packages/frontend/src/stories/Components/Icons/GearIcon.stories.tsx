import { Meta, StoryObj } from '@storybook/react';

import { GearIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof GearIcon> = {
  title: 'Icons/GearIcon',
  component: GearIcon,
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

type Story = StoryObj<typeof GearIcon>;

export const Default: Story = {
  render: ({ size, name }) => <GearIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
