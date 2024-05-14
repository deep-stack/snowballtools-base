import { Meta, StoryObj } from '@storybook/react';

import { SearchIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof SearchIcon> = {
  title: 'Icons/SearchIcon',
  component: SearchIcon,
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

type Story = StoryObj<typeof SearchIcon>;

export const Default: Story = {
  render: ({ size, name }) => <SearchIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
