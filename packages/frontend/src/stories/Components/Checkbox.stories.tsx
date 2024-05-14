import { StoryObj, Meta } from '@storybook/react';

import { Checkbox } from 'components/shared/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'string',
    description: 'string',
    checked: 'CheckedState' as unknown as any,
    defaultChecked: 'CheckedState' as unknown as any,
    required: 'boolean' as unknown as any,
    onCheckedChange: '(checked: CheckedState) => void' as unknown as any,
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
  }) => (
    <Checkbox
      label={label}
      description={description}
      checked={checked}
      defaultChecked={defaultChecked}
      required={required}
      onCheckedChange={onCheckedChange}
    />
  ),
};
