import { Meta, StoryObj } from '@storybook/react';

import { CheckIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CheckIcon> = {
  title: 'Icons/CheckIcon',
  component: CheckIcon,
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

type Story = StoryObj<typeof CheckIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CheckIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
