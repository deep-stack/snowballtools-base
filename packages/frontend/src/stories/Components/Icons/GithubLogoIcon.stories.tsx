import { Meta, StoryObj } from '@storybook/react';

import { GithubLogoIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof GithubLogoIcon> = {
  title: 'Icons/GithubLogoIcon',
  component: GithubLogoIcon,
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

type Story = StoryObj<typeof GithubLogoIcon>;

export const Default: Story = {
  render: ({ size, name }) => <GithubLogoIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
