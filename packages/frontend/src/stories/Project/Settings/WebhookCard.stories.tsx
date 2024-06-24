import { Meta, StoryObj } from '@storybook/react';

import WebhookCard from 'components/projects/project/settings/WebhookCard';

const meta: Meta<typeof WebhookCard> = {
  title: 'Project/Settings/WebhookCard',
  component: WebhookCard,
  tags: ['autodocs'],
  argTypes: {
    webhookUrl: {
      control: {
        type: 'text',
      },
    },
    onDelete: {
      action: 'delete',
    },
  },
};

export default meta;

type Story = StoryObj<typeof WebhookCard>;

export const Default: Story = {
  args: {
    webhookUrl: 'https://api.retool.com',
  },
};
