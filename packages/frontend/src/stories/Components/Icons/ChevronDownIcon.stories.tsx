import { Meta, StoryObj } from '@storybook/react';

import { ChevronDownIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ChevronDownIcon> = {
  title: 'Icons/ChevronDownIcon',
  component: ChevronDownIcon,
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

type Story = StoryObj<typeof ChevronDownIcon>;

export const Default: Story = {
  render: ({ size, name }) => <ChevronDownIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
