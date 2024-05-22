import { Meta, StoryObj } from '@storybook/react';

import { User } from 'gql-client';
import MemberCard from 'components/projects/project/settings/MemberCard';

const meta: Meta<typeof MemberCard> = {
  title: 'Project/Settings/MemberCard',
  component: MemberCard,
  tags: ['autodocs'],
  argTypes: {
    member: {
      control: 'object',
    },
    isFirstCard: {
      control: 'boolean',
    },
    isOwner: {
      control: 'boolean',
    },
    isPending: {
      control: 'boolean',
    },
    permissions: {
      control: 'object',
    },
  },
} as Meta<typeof MemberCard>;

export default meta;

type Story = StoryObj<typeof MemberCard>;

const defaultUser = {
  id: 'hellodsadass',
  name: 'Vivian',
  email: 'welcome@helloworld.com',
  isVerified: true,
  createdAt: 'blah',
  updatedAt: 'blah',
  gitHubToken: 'blah',
} as User;

export const Owner: Story = {
  render: ({ member, isFirstCard, isOwner, isPending, permissions }) => (
    <MemberCard
      member={member}
      isFirstCard={isFirstCard}
      isOwner={isOwner}
      isPending={isPending}
      permissions={permissions}
    />
  ),
  args: {
    member: defaultUser,
    isFirstCard: true,
    isOwner: true,
    isPending: false,
    permissions: [],
  },
};

export const ViewPlusEditMember: Story = {
  render: ({ member, isFirstCard, isOwner, isPending, permissions }) => (
    <MemberCard
      member={member}
      isFirstCard={isFirstCard}
      isOwner={isOwner}
      isPending={isPending}
      permissions={permissions}
    />
  ),
  args: {
    member: defaultUser,
    isFirstCard: true,
    isOwner: false,
    isPending: false,
    permissions: ['View+Edit'],
  },
};

export const ViewMember: Story = {
  render: ({ member, isFirstCard, isOwner, isPending, permissions }) => (
    <MemberCard
      member={member}
      isFirstCard={isFirstCard}
      isOwner={isOwner}
      isPending={isPending}
      permissions={permissions}
    />
  ),
  args: {
    member: defaultUser,
    isFirstCard: true,
    isOwner: false,
    isPending: false,
    permissions: ['View'],
  },
};
