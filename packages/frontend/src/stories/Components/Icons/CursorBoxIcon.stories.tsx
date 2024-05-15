import { Meta, StoryObj } from '@storybook/react';

import { CursorBoxIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CursorBoxIcon> = {
  title: 'Icons/CursorBoxIcon',
  component: CursorBoxIcon,
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

type Story = StoryObj<typeof CursorBoxIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CursorBoxIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
