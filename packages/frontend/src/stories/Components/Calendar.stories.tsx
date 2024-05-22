import { StoryObj, Meta } from '@storybook/react';

import { Calendar } from 'components/shared/Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    wrapperProps: {
      control: 'object',
    },
    calendarWrapperProps: {
      control: 'object',
    },
    footerProps: {
      control: 'object',
    },
    actions: {
      control: 'object',
    },
    onSelect: {
      action: 'select',
    },
    onCancel: {
      action: 'cancel',
    },
    onReset: {
      action: 'reset',
    },
    selectRange: {
      control: 'boolean',
    },
    activeStartDate: {
      control: 'date',
    },
    value: {
      control: 'date',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};

export const ToShowCode: Story = {
  render: ({
    wrapperProps,
    calendarWrapperProps,
    footerProps,
    actions,
    onSelect,
    onCancel,
    onReset,
    selectRange,
    activeStartDate,
    value,
    ...arg
  }) => (
    <Calendar
      wrapperProps={wrapperProps}
      calendarWrapperProps={calendarWrapperProps}
      footerProps={footerProps}
      actions={actions}
      onSelect={onSelect}
      onCancel={onCancel}
      onReset={onReset}
      selectRange={selectRange}
      activeStartDate={activeStartDate}
      value={value}
      {...arg}
    />
  ),
  args: {
    actions: <div>Actions</div>,
    onSelect: (value) => console.log(value),
    onCancel: () => console.log('Cancel'),
    onReset: () => console.log('Reset'),
    selectRange: false,
    activeStartDate: new Date(),
    value: new Date(),
  },
};
