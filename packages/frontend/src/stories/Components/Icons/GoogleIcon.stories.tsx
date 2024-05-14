import { Meta, StoryObj } from '@storybook/react';

import { GoogleIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof GoogleIcon> = {
  title: 'Icons/GoogleIcon',
  component: GoogleIcon,
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

type Story = StoryObj<typeof GoogleIcon>;

export const Default: Story = {
  render: ({ size, name }) => <GoogleIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
