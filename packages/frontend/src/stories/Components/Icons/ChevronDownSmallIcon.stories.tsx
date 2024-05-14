import { Meta, StoryObj } from '@storybook/react';

import { ChevronDownSmallIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ChevronDownSmallIcon> = {
  title: 'Icons/ChevronDownSmallIcon',
  component: ChevronDownSmallIcon,
  tags: ['autodocs'],
  args: {
    size: 'string | number' as unknown as any,
    name: 'string',
  },
};

export default meta;

type Story = StoryObj<typeof ChevronDownSmallIcon>;

export const Default: Story = {
  render: ({ size, name }) => <ChevronDownSmallIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
