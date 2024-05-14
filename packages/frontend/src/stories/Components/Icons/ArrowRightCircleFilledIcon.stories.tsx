import { Meta, StoryObj } from '@storybook/react';

import { ArrowRightCircleFilledIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ArrowRightCircleFilledIcon> = {
  title: 'Icons/ArrowRightCircleFilledIcon',
  component: ArrowRightCircleFilledIcon,
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

type Story = StoryObj<typeof ArrowRightCircleFilledIcon>;

export const Default: Story = {
  render: ({ size, name }) => (
    <ArrowRightCircleFilledIcon size={size} name={name} />
  ),
  args: {
    size: '24px',
    name: 'plus',
  },
};
