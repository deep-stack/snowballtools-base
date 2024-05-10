import { Meta, StoryObj } from '@storybook/react';

import { MinusCircleIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof MinusCircleIcon> = {
  title: 'Icons/MinusCircleIcon',
  component: MinusCircleIcon,
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

type Story = StoryObj<typeof MinusCircleIcon>;

export const Default: Story = {
  render: ({ size, name }) => <MinusCircleIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
