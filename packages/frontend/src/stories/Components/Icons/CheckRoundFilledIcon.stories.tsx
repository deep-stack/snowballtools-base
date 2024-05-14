import { Meta, StoryObj } from '@storybook/react';

import { CheckRoundFilledIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CheckRoundFilledIcon> = {
  title: 'Icons/CheckRoundFilledIcon',
  component: CheckRoundFilledIcon,
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

type Story = StoryObj<typeof CheckRoundFilledIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CheckRoundFilledIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
