import { Meta, StoryObj } from '@storybook/react';

import { SwitchIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof SwitchIcon> = {
  title: 'Icons/SwitchIcon',
  component: SwitchIcon,
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

type Story = StoryObj<typeof SwitchIcon>;

export const Default: Story = {
  render: ({ size, name }) => <SwitchIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
