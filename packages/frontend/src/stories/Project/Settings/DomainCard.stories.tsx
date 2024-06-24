import { StoryObj, Meta } from '@storybook/react';

import DomainCard from 'components/projects/project/settings/DomainCard';
import { domain0, domain1, project } from '../../MockStoriesData';

const meta: Meta<typeof DomainCard> = {
  title: 'Project/Settings/DomainCard',
  component: DomainCard,
  tags: ['autodocs'],
  argTypes: {
    domains: {
      control: {
        type: 'object',
      },
    },
    domain: {
      control: {
        type: 'object',
      },
    },
    branches: {
      control: {
        type: 'object',
      },
    },
    project: {
      control: {
        type: 'object',
      },
    },
    onUpdate: {
      action: 'update',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DomainCard>;

export const Default: Story = {
  args: {
    domains: [domain0, domain1],
    domain: domain0,
    branches: ['main'],
    project: project,
  },
};
