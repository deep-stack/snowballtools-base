import { Meta, StoryObj } from '@storybook/react';

import { EditBigIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof EditBigIcon> = {
  title: 'Icons/EditBigIcon',
  component: EditBigIcon,
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

type Story = StoryObj<typeof EditBigIcon>;

export const Default: Story = {
  render: ({ size, name }) => <EditBigIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
