import { Meta, StoryObj } from '@storybook/react';

import { GitHubLogo } from 'components/shared/CustomIcon';

const meta: Meta<typeof GitHubLogo> = {
  title: 'Icons/GitHubLogo',
  component: GitHubLogo,
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

type Story = StoryObj<typeof GitHubLogo>;

export const Default: Story = {
  render: ({ size, name }) => <GitHubLogo size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
