import { Meta, StoryObj } from '@storybook/react';

import { ChevronRight } from '../../../components/shared/CustomIcon/ChevronRight';

const meta: Meta<typeof ChevronRight> = {
  title: 'Icons/ChevronRight',
  component: ChevronRight,
  tags: ['autodocs'],
  args: {
    size: 'string | number' as unknown as any,
    name: 'string',
  },
};

export default meta;

type Story = StoryObj<typeof ChevronRight>;

export const Default: Story = {
  render: ({ size, name }) => <ChevronRight size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
