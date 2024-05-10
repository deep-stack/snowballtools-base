import { Meta, StoryObj } from '@storybook/react';

import { ChevronDoubleDownIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ChevronDoubleDownIcon> = {
  title: 'Icons/ChevronDoubleDownIcon',
  component: ChevronDoubleDownIcon,
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

type Story = StoryObj<typeof ChevronDoubleDownIcon>;

export const Default: Story = {
  render: ({ size, name }) => <ChevronDoubleDownIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
