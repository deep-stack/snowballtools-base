import { StoryObj, Meta } from '@storybook/react';
import { PlusIcon } from 'components/shared/CustomIcon';

import { InlineNotification } from 'components/shared/InlineNotification';

const inlineNotificationVariants = [
  'info',
  'danger',
  'warning',
  'success',
  'generic',
];
const inlineNotificationSizes = ['md', 'sm'];

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
