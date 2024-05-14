import { StoryObj, Meta } from '@storybook/react';

import { DatePicker } from 'components/shared/DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    calendarProps: {
      control: 'object',
    },
    onChange: {
      action: 'change',
    },
    value: {
      control: 'text',
    },
    selectRange: {
      control: 'boolean',
    },
    onReset: {
      action: 'reset',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: ({
    calendarProps,
    onChange,
    value,
    selectRange,
    onReset,
    ...args
  }) => (
    <DatePicker
      calendarProps={calendarProps}
      onChange={onChange}
      value={value}
      selectRange={selectRange}
      onReset={onReset}
      {...args}
    />
  ),
};
