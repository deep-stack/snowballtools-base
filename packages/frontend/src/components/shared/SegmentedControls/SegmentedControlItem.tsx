import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

import {
  segmentedControlsTheme,
  type SegmentedControlsVariants,
} from './SegmentedControls.theme';
import { cloneIcon } from 'utils/cloneIcon';

/**
 * Interface for the props of a segmented control item component.
 */
export interface SegmentedControlItemProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'children'>,
    SegmentedControlsVariants {
  /**
   * The optional left icon element for a component.
   */
  leftIcon?: ReactNode;
  /**
   * The optional right icon element to display.
   */
  rightIcon?: ReactNode;
  /**
   * Indicates whether the item is active or not.
   */
  active?: boolean;
  /**
   * Optional prop that represents the children of a React component.
   */
  children?: ReactNode;
}

/**
 * A functional component that represents an item in a segmented control.
 * @returns The rendered segmented control item.
 */
const SegmentedControlItem = forwardRef<
  HTMLButtonElement,
  SegmentedControlItemProps
>(
  (
    {
      className,
      children,
      size,
      type,
      leftIcon,
      rightIcon,
      active = false,
      ...props
    },
    ref,
  ) => {
    const { item, icon } = segmentedControlsTheme({ size, type });

    return (
      <button
        {...props}
        ref={ref}
        className={item({ className })}
        data-active={active}
      >
        {leftIcon && cloneIcon(leftIcon, { className: icon({ size }) })}
        {children}
        {rightIcon && cloneIcon(rightIcon, { className: icon({ size }) })}
      </button>
    );
  },
);

SegmentedControlItem.displayName = 'SegmentedControlItem';

export { SegmentedControlItem };
