import React, {
  ComponentPropsWithRef,
  MouseEvent,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import {
  Calendar as ReactCalendar,
  CalendarProps as ReactCalendarProps,
} from 'react-calendar';
import { CalendarTheme, calendarTheme } from './Calendar.theme';
import { Button } from 'components/shared/Button';
import {
  ChevronGrabberHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'components/shared/CustomIcon';

import './Calendar.css';
import { format } from 'date-fns';
import { cn } from 'utils/classnames';

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];
const CALENDAR_VIEW = ['month', 'year', 'decade'] as const;
export type CalendarView = (typeof CALENDAR_VIEW)[number];

/**
 * Defines a custom set of props for a React calendar component by excluding specific props
 * from the original ReactCalendarProps type.
 * @type {CustomReactCalendarProps}
 */
type CustomReactCalendarProps = Omit<
  ReactCalendarProps,
  'view' | 'showNavigation' | 'onClickMonth' | 'onClickYear'
>;

export interface CalendarProps extends CustomReactCalendarProps, CalendarTheme {
  /**
   * Optional props for wrapping a component with a div element.
   */
  wrapperProps?: ComponentPropsWithRef<'div'>;
  /**
   * Props for the calendar wrapper component.
   */
  calendarWrapperProps?: ComponentPropsWithRef<'div'>;
  /**
   * Optional props for the footer component.
   */
  footerProps?: ComponentPropsWithRef<'div'>;
  /**
   * Optional custom actions to be rendered.
   */
  actions?: ReactNode;
  /**
   * Optional callback function that is called when a value is selected.
   * @param {Value} value - The selected value
   * @returns None
   */
  onSelect?: (value: Value) => void;
  /**
   * Optional callback function that is called when a cancel action is triggered.
   * @returns None
   */
  onCancel?: () => void;
  /**
   * Optional callback function that is called when a reset action is triggered.
   * @returns None
   */
  onReset?: () => void;
}

/**
 * Calendar component that allows users to select dates and navigate through months and years.
 * @param {Object} CalendarProps - Props for the Calendar component.
 * @returns {JSX.Element} A calendar component with navigation, date selection, and actions.
 */
export const Calendar = ({
  selectRange,
  activeStartDate: activeStartDateProp,
  value: valueProp,
  wrapperProps,
  calendarWrapperProps,
  footerProps,
  actions,
  onSelect,
  onCancel,
  onReset,
  onChange: onChangeProp,
  ...props
}: CalendarProps): JSX.Element => {
  const {
    wrapper,
    calendar,
    navigation,
    actions: actionsClass,
    button,
    footer,
  } = calendarTheme();

  const today = new Date();
  const currentMonth = format(today, 'MMM');
  const currentYear = format(today, 'yyyy');

  const [view, setView] = useState<CalendarView>('month');
  const [activeDate, setActiveDate] = useState<Date>(
    activeStartDateProp ?? today,
  );
  const [value, setValue] = useState<Value>(valueProp as Value);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  /**
   * Update the navigation label based on the active date
   */
  const changeNavigationLabel = useCallback(
    (date: Date) => {
      setMonth(format(date, 'MMM'));
      setYear(format(date, 'yyyy'));
    },
    [setMonth, setYear],
  );

  /**
   * Change the active date base on the action and range
   */
  const handleNavigate = useCallback(
    (action: 'previous' | 'next', view: CalendarView) => {
      setActiveDate((date) => {
        const newDate = new Date(date);
        switch (view) {
          case 'month':
            newDate.setMonth(
              action === 'previous' ? date.getMonth() - 1 : date.getMonth() + 1,
            );
            break;
          case 'year':
            newDate.setFullYear(
              action === 'previous'
                ? date.getFullYear() - 1
                : date.getFullYear() + 1,
            );
            break;
          case 'decade':
            newDate.setFullYear(
              action === 'previous'
                ? date.getFullYear() - 10
                : date.getFullYear() + 10,
            );
            break;
        }
        changeNavigationLabel(newDate);
        return newDate;
      });
    },
    [setActiveDate, changeNavigationLabel],
  );

  /**
   * Change the view of the calendar
   */
  const handleChangeView = useCallback(
    (view: CalendarView) => {
      setView(view);
    },
    [setView],
  );

  /**
   * Change the active date and set the view to the selected type
   * and also update the navigation label
   */
  const handleChangeNavigation = useCallback(
    (view: 'month' | 'year', date: Date) => {
      setActiveDate(date);
      changeNavigationLabel(date);
      setView(view);
    },
    [setActiveDate, changeNavigationLabel, setView],
  );

  const handlePrevious = useCallback(() => {
    switch (view) {
      case 'month':
        return handleNavigate('previous', 'month');
      case 'year':
        return handleNavigate('previous', 'year');
      case 'decade':
        return handleNavigate('previous', 'decade');
    }
  }, [view]);

  const handleNext = useCallback(() => {
    switch (view) {
      case 'month':
        return handleNavigate('next', 'month');
      case 'year':
        return handleNavigate('next', 'year');
      case 'decade':
        return handleNavigate('next', 'decade');
    }
  }, [view]);

  const handleChange = useCallback(
    (newValue: Value, event: MouseEvent<HTMLButtonElement>) => {
      setValue(newValue);

      // Call the onChange prop if it exists
      onChangeProp?.(newValue, event);

      /**
       * Update the active date and navigation label
       *
       * NOTE:
       * For range selection, the active date is not updated
       * The user only can select multiple dates within the same month
       */
      if (!selectRange) {
        setActiveDate(newValue as Date);
        changeNavigationLabel(newValue as Date);
      }
    },
    [setValue, setActiveDate, changeNavigationLabel, selectRange],
  );

  const handleReset = useCallback(() => {
    setValue(null);
    onReset?.();
  }, [setValue, onReset]);

  return (
    <div
      {...wrapperProps}
      className={wrapper({ className: wrapperProps?.className })}
    >
      {/* Calendar wrapper */}
      <div
        {...calendarWrapperProps}
        className={calendar({ className: calendarWrapperProps?.className })}
      >
        {/* Navigation */}
        <div className={navigation()}>
          <Button iconOnly size="sm" variant="ghost" onClick={handlePrevious}>
            <ChevronLeft />
          </Button>
          <div className={actionsClass()}>
            <Button
              variant="unstyled"
              className={button()}
              rightIcon={
                <ChevronGrabberHorizontal className="text-elements-low-em" />
              }
              onClick={() => handleChangeView('year')}
            >
              {month}
            </Button>
            <Button
              variant="unstyled"
              className={button()}
              rightIcon={
                <ChevronGrabberHorizontal className="text-elements-low-em" />
              }
              onClick={() => handleChangeView('decade')}
            >
              {year}
            </Button>
          </div>
          <Button iconOnly size="sm" variant="ghost" onClick={handleNext}>
            <ChevronRight />
          </Button>
        </div>

        {/* Calendar */}
        <ReactCalendar
          {...props}
          activeStartDate={activeDate}
          view={view}
          value={value}
          showNavigation={false}
          selectRange={selectRange}
          onChange={handleChange}
          onClickMonth={(date) => handleChangeNavigation('month', date)}
          onClickYear={(date) => handleChangeNavigation('year', date)}
        />
      </div>

      {/* Footer or CTA */}
      <div
        {...footerProps}
        className={cn(footer({ className: footerProps?.className }), {
          'justify-between': Boolean(value),
        })}
      >
        {actions ? (
          actions
        ) : (
          <>
            {value && (
              <Button variant="danger" onClick={handleReset}>
                Reset
              </Button>
            )}
            <div className="space-x-3">
              <Button variant="tertiary" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                disabled={!value}
                onClick={() => (value ? onSelect?.(value) : null)}
              >
                Select
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
