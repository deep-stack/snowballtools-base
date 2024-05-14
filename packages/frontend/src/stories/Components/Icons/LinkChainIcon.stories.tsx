import { Meta, StoryObj } from '@storybook/react';

import { LinkChainIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof LinkChainIcon> = {
  title: 'Icons/LinkChainIcon',
  component: LinkChainIcon,
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

type Story = StoryObj<typeof LinkChainIcon>;

export const Default: Story = {
  render: ({ size, name }) => <LinkChainIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
