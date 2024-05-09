import { Meta, StoryObj } from '@storybook/react';

import { Avatar, AvatarVariants } from 'components/shared/Avatar';
import { avatars, avatarsFallback } from '../pages/components/renders/avatar';

const avatarSizes: AvatarVariants['size'][] = [18, 20, 24, 28, 32, 36, 40, 44];
const avatarVariants: AvatarVariants['type'][] = ['gray', 'orange', 'blue'];

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: 'Components/Avatar',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: avatarSizes,
    },
    imageSrc: {
      control: 'text',
    },
    initials: {
      control: 'text',
    },
    type: {
      control: 'select',
      options: avatarVariants,
    },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: ({ initials, imageSrc, size, type, ...arg }) => (
    <Avatar
      initials={initials}
      imageSrc={imageSrc}
      size={size}
      type={type}
      {...arg}
    />
  ),
};

export const Fallback: Story = {
  render: ({ initials, imageSrc, size, type, ...arg }) => (
    <Avatar
      initials={initials}
      imageSrc={imageSrc}
      size={size}
      type={type}
      {...arg}
    />
  ),
  args: {
    initials: 'SY',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-5 flex-wrap">
      {avatars.map((avatar) => avatar)}
    </div>
  ),
};

export const FallbackAll: Story = {
  render: () => (
    <div className="flex gap-5 flex-wrap">
      {avatarsFallback.map((avatar) => avatar)}
    </div>
  ),
};
