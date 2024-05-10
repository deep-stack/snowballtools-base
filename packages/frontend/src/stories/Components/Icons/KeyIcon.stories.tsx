import { Meta, StoryObj } from '@storybook/react';

import { KeyIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof KeyIcon> = {
  title: 'Icons/KeyIcon',
  component: KeyIcon,
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

type Story = StoryObj<typeof KeyIcon>;

export const Default: Story = {
  render: ({ size, name }) => <KeyIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
