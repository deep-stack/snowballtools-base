import { Meta, StoryObj } from '@storybook/react';

import { LinkIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof LinkIcon> = {
  title: 'Icons/LinkIcon',
  component: LinkIcon,
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

type Story = StoryObj<typeof LinkIcon>;

export const Default: Story = {
  render: ({ size, name }) => <LinkIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
