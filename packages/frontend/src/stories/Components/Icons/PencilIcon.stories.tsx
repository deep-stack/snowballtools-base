import { Meta, StoryObj } from '@storybook/react';

import { PencilIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof PencilIcon> = {
  title: 'Icons/PencilIcon',
  component: PencilIcon,
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

type Story = StoryObj<typeof PencilIcon>;

export const Default: Story = {
  render: ({ size, name }) => <PencilIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
