import { Meta, StoryObj } from '@storybook/react';

import { InfoSquareIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof InfoSquareIcon> = {
  title: 'Icons/InfoSquareIcon',
  component: InfoSquareIcon,
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

type Story = StoryObj<typeof InfoSquareIcon>;

export const Default: Story = {
  render: ({ size, name }) => <InfoSquareIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
