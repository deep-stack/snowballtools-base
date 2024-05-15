import { Meta, StoryObj } from '@storybook/react';

import { WarningTriangleIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof WarningTriangleIcon> = {
  title: 'Icons/WarningTriangleIcon',
  component: WarningTriangleIcon,
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

type Story = StoryObj<typeof WarningTriangleIcon>;

export const Default: Story = {
  render: ({ size, name }) => <WarningTriangleIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
