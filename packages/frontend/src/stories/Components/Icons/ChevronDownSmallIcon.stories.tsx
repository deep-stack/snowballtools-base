import { Meta, StoryObj } from '@storybook/react';

import { ChevronDownSmallIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ChevronDownSmallIcon> = {
  title: 'Icons/ChevronDownSmallIcon',
  component: ChevronDownSmallIcon,
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

type Story = StoryObj<typeof ChevronDownSmallIcon>;

export const Default: Story = {
  render: ({ size, name }) => <ChevronDownSmallIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
