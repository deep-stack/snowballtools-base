import { Meta, StoryObj } from '@storybook/react';

import { SnowballIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof SnowballIcon> = {
  title: 'Icons/SnowballIcon',
  component: SnowballIcon,
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

type Story = StoryObj<typeof SnowballIcon>;

export const Default: Story = {
  render: ({ size, name }) => <SnowballIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
