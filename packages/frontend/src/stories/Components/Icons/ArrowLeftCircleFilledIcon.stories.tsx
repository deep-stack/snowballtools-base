import { Meta, StoryObj } from '@storybook/react';

import { ArrowLeftCircleFilledIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ArrowLeftCircleFilledIcon> = {
  title: 'Icons/ArrowLeftCircleFilledIcon',
  component: ArrowLeftCircleFilledIcon,
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

type Story = StoryObj<typeof ArrowLeftCircleFilledIcon>;

export const Default: Story = {
  render: ({ size, name }) => (
    <ArrowLeftCircleFilledIcon size={size} name={name} />
  ),
  args: {
    size: '24px',
    name: 'plus',
  },
};
