import { Meta, StoryObj } from '@storybook/react';

import { GithubIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof GithubIcon> = {
  title: 'Icons/GithubIcon',
  component: GithubIcon,
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

type Story = StoryObj<typeof GithubIcon>;

export const Default: Story = {
  render: ({ size, name }) => <GithubIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
