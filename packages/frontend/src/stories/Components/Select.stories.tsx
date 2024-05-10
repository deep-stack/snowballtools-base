import { StoryObj, Meta } from '@storybook/react';

import { Select } from 'components/shared/Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
    },
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    multiple: {
      control: 'boolean',
    },
    searchable: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    leftIcon: {
      control: 'text',
    },
    rightIcon: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    hideValues: {
      control: 'boolean',
    },
    value: {
      control: 'object',
    },
    onClear: {
      action: 'clear',
    },
    onChange: {
      action: 'change',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: ({
    options,
    label,
    description,
    multiple,
    searchable,
    clearable,
    leftIcon,
    rightIcon,
    helperText,
    hideValues,
    value,
    onClear,
    onChange,
  }) => (
    <Select
      options={options}
      label={label}
      description={description}
      multiple={multiple}
      searchable={searchable}
      clearable={clearable}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      helperText={helperText}
      hideValues={hideValues}
      value={value}
      onClear={onClear}
      onChange={onChange}
    />
  ),
  args: {
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    label: 'Select',
    description: 'Select an option',
    multiple: false,
    searchable: false,
    clearable: false,
    leftIcon: '',
    rightIcon: '',
    helperText: '',
    hideValues: false,
    value: { label: 'Option 1', value: 'option1' },
  },
};
