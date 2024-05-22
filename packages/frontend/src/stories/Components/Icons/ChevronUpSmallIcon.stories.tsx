import { Meta, StoryObj } from '@storybook/react';

import { ChevronUpSmallIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ChevronUpSmallIcon> = {
  title: 'Components/ChevronUpSmallIcon',
  component: ChevronUpSmallIcon,
  tags: ['autodocs'],
  args: {
    size: 'string | number' as unknown as any,
    name: 'string',
  },
};

export default meta;

type Story = StoryObj<typeof ChevronUpSmallIcon>;

export const Default: Story = {
  render: ({ size, name }) => <ChevronUpSmallIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'chevron-up',
  },
};
