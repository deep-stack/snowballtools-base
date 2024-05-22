import { Meta, StoryObj } from '@storybook/react';

import { CalendarIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CalendarIcon> = {
  title: 'Icons/CalendarIcon',
  component: CalendarIcon,
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

type Story = StoryObj<typeof CalendarIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CalendarIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
