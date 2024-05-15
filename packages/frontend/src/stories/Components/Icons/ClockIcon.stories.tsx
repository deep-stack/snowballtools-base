import { Meta, StoryObj } from '@storybook/react';

import { ClockIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ClockIcon> = {
  title: 'Icons/ClockIcon',
  component: ClockIcon,
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

type Story = StoryObj<typeof ClockIcon>;

export const Default: Story = {
  render: ({ size, name }) => <ClockIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
