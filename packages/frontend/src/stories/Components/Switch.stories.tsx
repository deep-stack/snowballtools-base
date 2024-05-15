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
      action: 'checkedChange',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Label',
  },
};

export const WithDescription: Story = {
  args: {
    description: 'Description',
  },
};

export const WithWrapperProps: Story = {
  args: {
    wrapperProps: {
      style: {
        border: '1px solid red',
      },
    },
  },
};

export const WithLabelAndDescription: Story = {
  args: {
    label: 'Label',
    description: 'Description',
  },
};

export const WithLabelAndDescriptionAndWrapperProps: Story = {
  args: {
    label: 'Label',
    description: 'Description',
    wrapperProps: {
      style: {
        border: '1px solid red',
      },
    },
  },
};

export const FullWidthWithLabelAndDescription: Story = {
  args: {
    fullWidth: true,
    label: 'Label',
    description: 'Description',
  },
};
