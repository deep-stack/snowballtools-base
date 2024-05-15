import { StoryObj, Meta } from '@storybook/react';
import { PlusIcon } from 'components/shared/CustomIcon';

import { Select, SelectOption, SelectTheme } from 'components/shared/Select';

const selectOrientation: SelectTheme['orientation'][] = [
  'horizontal',
  'vertical',
];
const selectVariants: SelectTheme['variant'][] = ['default', 'danger'];
const selectSizes: SelectTheme['size'][] = ['sm', 'md'];
const selectError: SelectTheme['error'][] = [true, false];
const selectIsOpen: SelectTheme['isOpen'][] = [true, false];
const selectOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

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
      type: 'boolean',
    },
    searchable: {
      type: 'boolean',
    },
    clearable: {
      type: 'boolean',
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
      type: 'boolean',
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
    orientation: {
      control: 'radio',
      options: selectOrientation,
    },
    placeholder: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: selectVariants,
    },
    size: {
      control: 'select',
      options: selectSizes,
    },
    error: {
      control: 'radio',
      options: selectError,
    },
    isOpen: {
      control: 'radio',
      options: selectIsOpen,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options: selectOptions,
    label: 'Select',
    description: 'Select an option',
  },
};

export const Multiple: Story = {
  args: {
    ...Default.args,
    multiple: true,
  },
};

export const Searchable: Story = {
  args: {
    ...Default.args,
    searchable: true,
  },
};

export const Clearable: Story = {
  args: {
    ...Default.args,
    clearable: true,
  },
};

export const LeftIcon: Story = {
  args: {
    ...Default.args,
    leftIcon: <PlusIcon />,
  },
};

export const RightIcon: Story = {
  args: {
    ...Default.args,
    rightIcon: <PlusIcon />,
  },
};

export const HelperText: Story = {
  args: {
    ...Default.args,
    helperText: 'Helper text',
  },
};

export const HideValues: Story = {
  args: {
    ...Default.args,
    hideValues: true,
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    error: true,
  },
};

export const IsOpen: Story = {
  args: {
    ...Default.args,
    isOpen: true,
  },
};

export const WithValue: Story = {
  args: {
    ...Default.args,
    value: selectOptions[0],
  },
};

export const WithPlaceholder: Story = {
  args: {
    ...Default.args,
    placeholder: 'Select an option',
  },
};

// TODO: fix Select danger variant
export const WithVariantDanger: Story = {
  args: {
    ...Default.args,
    variant: 'danger',
  },
};
