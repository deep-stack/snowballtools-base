import { Meta, StoryObj } from '@storybook/react';

import { CrossCircleIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CrossCircleIcon> = {
  title: 'Icons/CrossCircleIcon',
  component: CrossCircleIcon,
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

type Story = StoryObj<typeof CrossCircleIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CrossCircleIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
