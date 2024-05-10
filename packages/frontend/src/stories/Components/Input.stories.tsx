import { StoryObj, Meta } from '@storybook/react';

import { Input } from 'components/shared/Input';
import { PlusIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
    />
  ),
};

export const WithLeftIcon: Story = {
  render: ({ label, description, leftIcon }) => (
    <Input label={label} description={description} leftIcon={leftIcon} />
  ),
  args: {
    ...Default.args,
    leftIcon: <PlusIcon />,
  },
};

export const WithRightIcon: Story = {
  render: ({ label, description, rightIcon }) => (
    <Input label={label} description={description} rightIcon={rightIcon} />
  ),
  args: {
    ...Default.args,
    rightIcon: <PlusIcon />,
  },
};

export const WithLeftAndRightIcon: Story = {
  render: ({ label, description, leftIcon, rightIcon }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
    />
  ),
  args: {
    ...Default.args,
    leftIcon: <PlusIcon />,
    rightIcon: <PlusIcon />,
  },
};

export const WithDescription: Story = {
  render: ({ label, description }) => (
    <Input label={label} description={description} />
  ),
  args: {
    ...Default.args,
    description: 'description',
  },
};

export const WithHelperText: Story = {
  render: ({ helperText }) => <Input helperText={helperText} />,
  args: {
    ...Default.args,
    helperText: 'helper text',
  },
};

export const WithLabel: Story = {
  render: ({ label }) => <Input label={label} />,
  args: {
    ...Default.args,
    label: 'label',
  },
};

export const WithPlaceholder: Story = {
  render: ({ placeholder }) => <Input placeholder={placeholder} />,
  args: {
    ...Default.args,
    placeholder: 'placeholder',
  },
};

export const WithValue: Story = {
  render: ({ value }) => <Input value={value} />,
  args: {
    ...Default.args,
    value: 'Value',
  },
};

export const WithDisabled: Story = {
  render: ({ disabled }) => <Input disabled={disabled} />,
  args: {
    ...Default.args,
    disabled: true,
  },
};
