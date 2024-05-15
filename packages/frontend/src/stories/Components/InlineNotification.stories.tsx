import { StoryObj, Meta } from '@storybook/react';

import {
  InlineNotification,
  InlineNotificationTheme,
} from 'components/shared/InlineNotification';
import { PlusIcon } from 'components/shared/CustomIcon';

const inlineNotificationVariants: InlineNotificationTheme['variant'][] = [
  'info',
  'danger',
  'warning',
  'success',
  'generic',
];
const inlineNotificationSizes: InlineNotificationTheme['size'][] = ['sm', 'md'];

const meta: Meta<typeof InlineNotification> = {
  title: 'Components/InlineNotification',
  component: InlineNotification,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    icon: {
      control: 'object',
    },
    variant: {
      control: 'select',
      options: inlineNotificationVariants,
    },
    size: {
      control: 'select',
      options: inlineNotificationSizes,
    },
    hasDescription: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof InlineNotification>;

export const Default: Story = {
  render: ({ title, description, icon, variant, ...args }) => (
    <InlineNotification
      title={title}
      description={description}
      icon={icon}
      variant={variant}
      {...args}
    />
  ),
  args: {
    title: 'title is required',
    variant: 'generic',
    size: 'md',
  },
};

export const WithDescription: Story = {
  render: ({ title, description, icon, ...args }) => (
    <InlineNotification
      title={title}
      description={description}
      icon={icon}
      {...args}
    />
  ),
  args: {
    ...Default.args,
    description: 'string',
  },
};

export const WithIcon: Story = {
  render: ({ title, description, icon, ...args }) => (
    <InlineNotification
      title={title}
      description={description}
      icon={icon}
      {...args}
    />
  ),
  args: {
    ...Default.args,
    icon: <PlusIcon />,
  },
};
