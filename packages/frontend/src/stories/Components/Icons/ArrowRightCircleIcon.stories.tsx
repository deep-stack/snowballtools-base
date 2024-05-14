import { Meta, StoryObj } from '@storybook/react';

import { ArrowRightCircleIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ArrowRightCircleIcon> = {
  title: 'Icons/ArrowRightCircleIcon',
  component: ArrowRightCircleIcon,
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

type Story = StoryObj<typeof ArrowRightCircleIcon>;

export const Default: Story = {
  render: ({ size, name }) => <ArrowRightCircleIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
