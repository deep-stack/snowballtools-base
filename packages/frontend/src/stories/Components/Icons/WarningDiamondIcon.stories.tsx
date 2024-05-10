import { Meta, StoryObj } from '@storybook/react';

import { WarningDiamondIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof WarningDiamondIcon> = {
  title: 'Icons/WarningDiamondIcon',
  component: WarningDiamondIcon,
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

type Story = StoryObj<typeof WarningDiamondIcon>;

export const Default: Story = {
  render: ({ size, name }) => <WarningDiamondIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
