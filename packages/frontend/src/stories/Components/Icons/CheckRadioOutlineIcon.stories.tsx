import { Meta, StoryObj } from '@storybook/react';

import { CheckRadioOutlineIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CheckRadioOutlineIcon> = {
  title: 'Icons/CheckRadioOutlineIcon',
  component: CheckRadioOutlineIcon,
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

type Story = StoryObj<typeof CheckRadioOutlineIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CheckRadioOutlineIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
