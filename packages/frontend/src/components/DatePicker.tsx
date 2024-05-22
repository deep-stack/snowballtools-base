import { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  DayPicker,
  SelectSingleEventHandler,
  DateRange,
} from 'react-day-picker';

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
} from '@snowballtools/material-tailwind-react-fork';

import HorizontalLine from './HorizontalLine';

// https://www.material-tailwind.com/docs/react/plugins/date-picker#date-picker
const DAY_PICKER_CLASS_NAMES = {
  caption: 'flex justify-center py-2 mb-4 relative items-center',
  caption_label: 'text-sm font-medium text-gray-900',
  nav: 'flex items-center',
  nav_button:
    'h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300',
  nav_button_previous: 'absolute left-1.5',
  nav_button_next: 'absolute right-1.5',
  table: 'w-full border-collapse',
  head_row: 'flex font-medium text-gray-900',
  head_cell: 'm-0.5 w-9 font-normal text-sm',
  row: 'flex w-full mt-2',
  cell: 'text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
  day: 'h-9 w-9 p-0 font-normal',
  day_range_end: 'day-range-end',
  day_selected:
    'rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white',
  day_today: 'rounded-md bg-gray-200 text-gray-900',
  day_outside:
    'day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10',
  day_disabled: 'text-gray-500 opacity-50',
  day_hidden: 'invisible',
};

type SingleDateHandler = (value: Date) => void;
type RangeDateHandler = (value: DateRange) => void;

interface SingleDatePickerProps {
  mode: 'single';
  selected?: Date;
  onSelect: SingleDateHandler;
}

interface RangeDatePickerProps {
  mode: 'range';
  selected?: DateRange;
  onSelect: RangeDateHandler;
}

const DatePicker = ({
  mode = 'single',
  selected,
  onSelect,
}: SingleDatePickerProps | RangeDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rangeSelected, setRangeSelected] = useState<DateRange>();

  const inputValue = useMemo(() => {
    if (mode === 'single') {
      return selected ? format(selected as Date, 'PPP') : 'Select Date';
    }

    if (mode === 'range') {
      const selectedRange = selected as DateRange | undefined;
      return selectedRange && selectedRange.from && selectedRange.to
        ? format(selectedRange.from, 'PP') +
            '-' +
            format(selectedRange.to, 'PP')
        : 'All time';
    }
  }, [selected, mode]);

  const handleSingleSelect = useCallback<SelectSingleEventHandler>((value) => {
    if (value) {
      (onSelect as SingleDateHandler)(value);
      setIsOpen(false);
    }
  }, []);

  const handleRangeSelect = useCallback(() => {
    if (rangeSelected?.to) {
      (onSelect as RangeDateHandler)(rangeSelected);
      setIsOpen(false);
    }
  }, [rangeSelected]);

  const components = {
    IconLeft: ({ ...props }) => (
      <i {...props} className="h-4 w-4 stroke-2">
        {'<'}
      </i>
    ),
    IconRight: ({ ...props }) => (
      <i {...props} className="h-4 w-4 stroke-2">
        {'>'}
      </i>
    ),
  };

  const commonDayPickerProps = {
    components,
    className: 'border-0',
    classNames: DAY_PICKER_CLASS_NAMES,
    showOutsideDays: true,
  };

  return (
    <Popover
      placement="bottom"
      open={isOpen}
      handler={(value) => setIsOpen(value)}
    >
      <PopoverHandler>
        <Input onChange={() => null} value={inputValue} />
      </PopoverHandler>
      {/* TODO: Figure out what placeholder is for */}
      {/* @ts-ignore */}
      <PopoverContent>
        {mode === 'single' && (
          <DayPicker
            mode="single"
            onSelect={handleSingleSelect}
            selected={selected as Date}
            {...commonDayPickerProps}
          />
        )}
        {mode === 'range' && (
          <>
            <DayPicker
              mode="range"
              onSelect={setRangeSelected}
              selected={rangeSelected as DateRange}
              {...commonDayPickerProps}
            />
            <HorizontalLine />
            <div className="flex justify-end">
              {/* TODO: Figure out what placeholder is for */}
              <Button
                size="sm"
                className="rounded-full mr-2"
                variant="outlined"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              {/* TODO: Figure out what placeholder is for */}
              <Button
                size="sm"
                className="rounded-full"
                color="gray"
                onClick={() => handleRangeSelect()}
              >
                Select
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
