import { Meta, StoryObj } from '@storybook/react';

import { HideEyeOffIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof HideEyeOffIcon> = {
  title: 'Icons/HideEyeOffIcon',
  component: HideEyeOffIcon,
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

type Story = StoryObj<typeof HideEyeOffIcon>;

export const Default: Story = {
  render: ({ size, name }) => <HideEyeOffIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
