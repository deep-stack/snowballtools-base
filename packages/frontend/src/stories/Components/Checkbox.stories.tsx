import { StoryObj, Meta } from '@storybook/react';

import { Checkbox } from 'components/shared/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    checked: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    onCheckedChange: {
      action: 'checkedChange',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: ({
    label,
    description,
    checked,
    defaultChecked,
    required,
    onCheckedChange,
    ...arg
  }) => (
    <Checkbox
      label={label}
      description={description}
      checked={checked}
      defaultChecked={defaultChecked}
      required={required}
      onCheckedChange={onCheckedChange}
      {...arg}
    />
  ),
  args: {
    label: 'Label',
    description: 'Description',
    checked: false,
    defaultChecked: false,
    required: false,
    onCheckedChange: (checked: boolean) => console.log(checked),
  },
};
