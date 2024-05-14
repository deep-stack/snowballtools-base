import { Meta, StoryObj } from '@storybook/react';

import { CrossIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CrossIcon> = {
  title: 'Icons/CrossIcon',
  component: CrossIcon,
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

type Story = StoryObj<typeof CrossIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CrossIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
