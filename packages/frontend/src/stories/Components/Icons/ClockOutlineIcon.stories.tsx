import { Meta, StoryObj } from '@storybook/react';

import { ClockOutlineIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ClockOutlineIcon> = {
  title: 'Icons/ClockOutlineIcon',
  component: ClockOutlineIcon,
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

type Story = StoryObj<typeof ClockOutlineIcon>;

export const Default: Story = {
  render: ({ size, name }) => <ClockOutlineIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
