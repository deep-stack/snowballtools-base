import { Meta, StoryObj } from '@storybook/react';

import { UndoIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof UndoIcon> = {
  title: 'Icons/UndoIcon',
  component: UndoIcon,
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

type Story = StoryObj<typeof UndoIcon>;

export const Default: Story = {
  render: ({ size, name }) => <UndoIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
