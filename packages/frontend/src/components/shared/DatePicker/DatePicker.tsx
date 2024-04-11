import { useCallback, useMemo, useState } from 'react';
import { Input, InputProps } from 'components/shared/Input';
import * as Popover from '@radix-ui/react-popover';
import { datePickerTheme } from './DatePicker.theme';
import { Calendar, CalendarProps } from 'components/shared/Calendar';
import {
  CalendarIcon,
  ChevronGrabberHorizontal,
} from 'components/shared/CustomIcon';
import { format } from 'date-fns';
import { Value } from 'types/vendor';

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
  /**
   * Optional callback function that is called when the date picker is reset.
   */
  onReset?: () => void;
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
  onReset,
  selectRange = false,
  ...props
}: DatePickerProps) => {
  const { input } = datePickerTheme();

  const [open, setOpen] = useState(false);

  /**
   * Renders the value of the date based on the current state of `props.value`.
   * @returns {string | undefined} - The formatted date value or `undefined` if `props.value` is falsy.
   */
  const renderValue = useMemo(() => {
    if (!value) return '';
    if (Array.isArray(value)) {
      return value
        .map((date) => format(date as Date, 'dd/MM/yyyy'))
        .join(' - ');
    }
    return format(value, 'dd/MM/yyyy');
  }, [value, onReset]);

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

  const handleReset = useCallback(() => {
    setOpen(false);
    onReset?.();
  }, [setOpen, onReset]);

  return (
    <Popover.Root open={open}>
      <Popover.Trigger className="w-full">
        <Input
          {...props}
          leftIcon={<CalendarIcon onClick={() => setOpen(true)} />}
          rightIcon={<ChevronGrabberHorizontal />}
          readOnly
          placeholder="Select a date..."
          value={renderValue}
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
            onReset={handleReset}
            onCancel={() => setOpen(false)}
            onSelect={handleSelect}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
