import { StoryObj, Meta } from '@storybook/react';

import { Calendar } from 'components/shared/Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: {
    wrapperProps: 'any' as unknown as any,
    calendarWrapperProps: 'any' as unknown as any,
    footerProps: 'any' as unknown as any,
    actions: 'any' as unknown as any,
    onSelect: () => {},
    onCancel: () => {},
    onReset: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: ({
    wrapperProps,
    calendarWrapperProps,
    footerProps,
    actions,
    onSelect,
    onCancel,
    onReset,
  }) => (
    <Calendar
      wrapperProps={wrapperProps}
      calendarWrapperProps={calendarWrapperProps}
      footerProps={footerProps}
      actions={actions}
      onSelect={onSelect}
      onCancel={onCancel}
      onReset={onReset}
    />
  ),
};
