import { Meta, StoryObj } from '@storybook/react';

import { CheckRadioIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CheckRadioIcon> = {
  title: 'Icons/CheckRadioIcon',
  component: CheckRadioIcon,
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

type Story = StoryObj<typeof CheckRadioIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CheckRadioIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
