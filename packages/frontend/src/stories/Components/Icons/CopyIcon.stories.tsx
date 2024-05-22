import { Meta, StoryObj } from '@storybook/react';

import { CopyIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CopyIcon> = {
  title: 'Icons/CopyIcon',
  component: CopyIcon,
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

type Story = StoryObj<typeof CopyIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CopyIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
