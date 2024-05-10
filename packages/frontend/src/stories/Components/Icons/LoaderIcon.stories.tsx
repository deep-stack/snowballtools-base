import { Meta, StoryObj } from '@storybook/react';

import { LoaderIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof LoaderIcon> = {
  title: 'Icons/LoaderIcon',
  component: LoaderIcon,
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

type Story = StoryObj<typeof LoaderIcon>;

export const Default: Story = {
  render: ({ size, name }) => <LoaderIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
