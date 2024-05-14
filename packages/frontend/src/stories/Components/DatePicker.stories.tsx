import { StoryObj, Meta } from '@storybook/react';

import { DatePicker } from 'components/shared/DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: ({ calendarProps, onChange, value, selectRange, onReset }) => (
    <DatePicker
      calendarProps={calendarProps}
      onChange={onChange}
      value={value}
      selectRange={selectRange}
      onReset={onReset}
    />
  ),
};
