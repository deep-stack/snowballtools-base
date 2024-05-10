import { Meta, StoryObj } from '@storybook/react';

import { FolderIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof FolderIcon> = {
  title: 'Icons/FolderIcon',
  component: FolderIcon,
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

type Story = StoryObj<typeof FolderIcon>;

export const Default: Story = {
  render: ({ size, name }) => <FolderIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
