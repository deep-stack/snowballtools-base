import { StoryObj, Meta } from '@storybook/react';

import { Input, InputTheme } from 'components/shared/Input';
import { PlusIcon } from 'components/shared/CustomIcon';

const inputStates: InputTheme['state'][] = ['default', 'error'];
const inputSizes: InputTheme['size'][] = ['sm', 'md'];

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
    state: {
      control: 'select',
      options: inputStates,
    },
    size: {
      control: 'select',
      options: inputSizes,
    },
    appearance: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
  },
  args: {
    state: 'default',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText, ...arg }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      {...arg}
    />
  ),
};

export const WithLeftIcon: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText, ...arg }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      {...arg}
    />
  ),
  args: {
    ...Default.args,
    leftIcon: <PlusIcon />,
  },
};

export const WithRightIcon: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText, ...arg }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      {...arg}
    />
  ),
  args: {
    ...Default.args,
    rightIcon: <PlusIcon />,
  },
};

export const WithLeftAndRightIcon: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText, ...arg }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      {...arg}
    />
  ),
  args: {
    ...Default.args,
    leftIcon: <PlusIcon />,
    rightIcon: <PlusIcon />,
  },
};

export const WithDescription: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText, ...arg }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      {...arg}
    />
  ),
  args: {
    ...Default.args,
    description: 'description',
  },
};

export const WithHelperText: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText, ...arg }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      {...arg}
    />
  ),
  args: {
    ...Default.args,
    helperText: 'helper text',
  },
};

export const WithLabel: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText, ...arg }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      {...arg}
    />
  ),
  args: {
    ...Default.args,
    label: 'label',
  },
};

export const WithPlaceholder: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText, ...arg }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      {...arg}
    />
  ),
  args: {
    ...Default.args,
    placeholder: 'placeholder',
  },
};

export const WithValue: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText, ...arg }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      {...arg}
    />
  ),
  args: {
    ...Default.args,
    value: 'Value',
  },
};

export const WithDisabled: Story = {
  render: ({ label, description, leftIcon, rightIcon, helperText, ...arg }) => (
    <Input
      label={label}
      description={description}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      {...arg}
    />
  ),
  args: {
    ...Default.args,
    disabled: true,
  },
};
