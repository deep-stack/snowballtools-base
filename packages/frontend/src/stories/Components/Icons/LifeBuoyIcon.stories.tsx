import { Meta, StoryObj } from '@storybook/react';

import { LifeBuoyIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof LifeBuoyIcon> = {
  title: 'Icons/LifeBuoyIcon',
  component: LifeBuoyIcon,
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

type Story = StoryObj<typeof LifeBuoyIcon>;

export const Default: Story = {
  render: ({ size, name }) => <LifeBuoyIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
