import React, { useCallback, useState } from 'react';
import { Input, InputProps } from 'components/shared/Input';
import * as Popover from '@radix-ui/react-popover';
import { datePickerTheme } from './DatePicker.theme';
import { Calendar, CalendarProps } from 'components/shared/Calendar';
import { CalendarIcon } from 'components/shared/CustomIcon';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import { format } from 'date-fns';

export interface DatePickerProps
  extends Omit<InputProps, 'onChange' | 'value'> {
  /**
   * The props for the calendar component.
   */
  calendarProps?: CalendarProps;
  /**
   * Optional callback function that is called when the value of the input changes.
   * @param {string} value - The new value of the input.
   * @returns None
   */
  onChange?: (value: Value) => void;
  /**
   * The value of the input.
   */
  value?: Value;
  /**
   * Whether to allow the selection of a date range.
   */
  selectRange?: boolean;
}

/**
 * A date picker component that allows users to select a date from a calendar.
 * @param {DatePickerProps} props - The props for the date picker component.
 * @returns The rendered date picker component.
 */
export const DatePicker = ({
  className,
  calendarProps,
  value,
  onChange,
  selectRange = false,
  ...props
}: DatePickerProps) => {
  const { input } = datePickerTheme();

  const [open, setOpen] = useState(false);

  /**
   * Renders the value of the date based on the current state of `props.value`.
   * @returns {string | undefined} - The formatted date value or `undefined` if `props.value` is falsy.
   */
  const renderValue = useCallback(() => {
    if (!value) return undefined;
    if (Array.isArray(value)) {
      return value
        .map((date) => format(date as Date, 'dd/MM/yyyy'))
        .join(' - ');
    }
    return format(value, 'dd/MM/yyyy');
  }, [value]);

  /**
   * Handles the selection of a date from the calendar.
   */
  const handleSelect = useCallback(
    (date: Value) => {
      setOpen(false);
      onChange?.(date);
    },
    [setOpen, onChange],
  );

  return (
    <Popover.Root open={open}>
      <Popover.Trigger>
        <Input
          {...props}
          rightIcon={<CalendarIcon onClick={() => setOpen(true)} />}
          readOnly
          placeholder="Select a date..."
          value={renderValue()}
          className={input({ className })}
          onClick={() => setOpen(true)}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-10"
          onInteractOutside={() => setOpen(false)}
        >
          <Calendar
            {...calendarProps}
            selectRange={selectRange}
            value={value}
            onCancel={() => setOpen(false)}
            onSelect={handleSelect}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
