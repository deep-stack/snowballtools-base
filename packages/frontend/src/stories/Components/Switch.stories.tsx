import { StoryObj, Meta } from '@storybook/react';

import { Switch } from 'components/shared/Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    wrapperProps: {
      control: 'object',
    },
    onCheckedChange: {
      action: 'onCheckedChange',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: ({ label, description, wrapperProps, onCheckedChange }) => (
    <Switch
      label={label}
      description={description}
      wrapperProps={wrapperProps}
      checked={false}
      onCheckedChange={onCheckedChange}
    />
  ),
};

export const Checked: Story = {
  render: ({ label, description, wrapperProps, onCheckedChange }) => (
    <Switch
      label={label}
      description={description}
      wrapperProps={wrapperProps}
      checked={true}
      onCheckedChange={onCheckedChange}
    />
  ),
};
