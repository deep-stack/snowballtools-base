import {
  useCallback,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

import {
  SegmentedControlItem,
  type SegmentedControlItemProps,
} from './SegmentedControlItem';
import {
  segmentedControlsTheme,
  type SegmentedControlsVariants,
} from './SegmentedControls.theme';

/**
 * Represents an option for a segmented control.
 */
export interface SegmentedControlsOption
  extends Omit<SegmentedControlItemProps, 'children'> {
  /**
   * The label of the item.
   */
  label: ReactNode;
  /**
   * The value of the item.
   *
   */
  value: string;
}

/**
 * Represents the props for the SegmentedControls component.
 */
export interface SegmentedControlsProps<T extends string = string>
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'>,
    SegmentedControlsVariants {
  /**
   * An array of options for a segmented control component.
   */
  options: SegmentedControlsOption[];
  /**
   * An optional string value.
   */
  value?: T;
  /**
   * Optional callback function to handle changes in state.
   */
  onChange?: (v: T) => void;
}

/**
 * A component that renders segmented controls with customizable options.
 */
export function SegmentedControls<T extends string = string>({
  className,
  options,
  value,
  type,
  size,
  onChange,
  ...props
}: SegmentedControlsProps<T>) {
  const { parent } = segmentedControlsTheme({ size, type });

  /**
   * Handles the change event for a given option.
   */
  const handleChange = useCallback(
    (option: T) => {
      if (!option) return;
      onChange?.(option);
    },
    [onChange],
  );

  return (
    <div {...props} className={parent({ className })}>
      {options.map((option, index) => (
        <SegmentedControlItem
          key={index}
          active={value === option.value}
          size={size}
          type={type}
          onClick={() => handleChange(option.value as T)}
          {...option}
        >
          {option.label}
        </SegmentedControlItem>
      ))}
    </div>
  );
}
