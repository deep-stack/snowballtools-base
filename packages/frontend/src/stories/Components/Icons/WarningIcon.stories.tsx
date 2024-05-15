import { Meta, StoryObj } from '@storybook/react';

import { WarningIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof WarningIcon> = {
  title: 'Icons/WarningIcon',
  component: WarningIcon,
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

type Story = StoryObj<typeof WarningIcon>;

export const Default: Story = {
  render: ({ size, name }) => <WarningIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
