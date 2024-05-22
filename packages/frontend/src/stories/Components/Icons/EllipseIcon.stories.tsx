import { Meta, StoryObj } from '@storybook/react';

import { EllipseIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof EllipseIcon> = {
  title: 'Icons/EclipseIcon',
  component: EllipseIcon,
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

type Story = StoryObj<typeof EllipseIcon>;

export const Default: Story = {
  render: ({ size, name }) => <EllipseIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
