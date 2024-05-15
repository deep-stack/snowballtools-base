import { Meta, StoryObj } from '@storybook/react';

import { EllipsesIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof EllipsesIcon> = {
  title: 'Icons/EllipsesIcon',
  component: EllipsesIcon,
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

type Story = StoryObj<typeof EllipsesIcon>;

export const Default: Story = {
  render: ({ size, name }) => <EllipsesIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
