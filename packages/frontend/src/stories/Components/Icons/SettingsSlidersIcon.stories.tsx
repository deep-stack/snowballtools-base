import { Meta, StoryObj } from '@storybook/react';

import { SettingsSlidersIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof SettingsSlidersIcon> = {
  title: 'Icons/SettingsSlidersIcon',
  component: SettingsSlidersIcon,
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

type Story = StoryObj<typeof SettingsSlidersIcon>;

export const Default: Story = {
  render: ({ size, name }) => <SettingsSlidersIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
