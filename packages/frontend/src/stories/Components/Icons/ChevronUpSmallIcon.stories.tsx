import { Meta, StoryObj } from '@storybook/react';

import { ChevronUpSmallIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ChevronUpSmallIcon> = {
  title: 'Icons/ChevronUpSmallIcon',
  component: ChevronUpSmallIcon,
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

type Story = StoryObj<typeof ChevronUpSmallIcon>;

export const Default: Story = {
  render: ({ size, name }) => <ChevronUpSmallIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'chevron-up',
  },
};
