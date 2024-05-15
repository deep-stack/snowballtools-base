import { Meta, StoryObj } from '@storybook/react';

import { GithubStrokeIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof GithubStrokeIcon> = {
  title: 'Icons/GithubStrokeLogo',
  component: GithubStrokeIcon,
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

type Story = StoryObj<typeof GithubStrokeIcon>;

export const Default: Story = {
  render: ({ size, name }) => <GithubStrokeIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
