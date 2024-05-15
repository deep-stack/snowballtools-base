import { Meta, StoryObj } from '@storybook/react';

import { BuildingIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof BuildingIcon> = {
  title: 'Icons/BuildingIcon',
  component: BuildingIcon,
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

type Story = StoryObj<typeof BuildingIcon>;

export const Default: Story = {
  render: ({ size, name }) => <BuildingIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
