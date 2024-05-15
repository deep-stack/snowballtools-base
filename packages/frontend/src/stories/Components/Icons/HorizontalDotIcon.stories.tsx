import { Meta, StoryObj } from '@storybook/react';

import { HorizontalDotIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof HorizontalDotIcon> = {
  title: 'Icons/HorizontalDotIcon',
  component: HorizontalDotIcon,
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

type Story = StoryObj<typeof HorizontalDotIcon>;

export const Default: Story = {
  render: ({ size, name }) => <HorizontalDotIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
