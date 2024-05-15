import { Meta, StoryObj } from '@storybook/react';

import { LoadingIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof LoadingIcon> = {
  title: 'Icons/LoadingIcon',
  component: LoadingIcon,
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

type Story = StoryObj<typeof LoadingIcon>;

export const Default: Story = {
  render: ({ size, name }) => <LoadingIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
