import { Meta, StoryObj } from '@storybook/react';

import { CalendarDaysIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CalendarDaysIcon> = {
  title: 'Icons/CalendarDaysIcon',
  component: CalendarDaysIcon,
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

type Story = StoryObj<typeof CalendarDaysIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CalendarDaysIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
