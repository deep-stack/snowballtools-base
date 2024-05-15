import { Meta, StoryObj } from '@storybook/react';

import { PlusIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof PlusIcon> = {
  title: 'Icons/PlusIcon',
  component: PlusIcon,
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

type Story = StoryObj<typeof PlusIcon>;

export const Default: Story = {
  render: ({ size, name }) => <PlusIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
