import React from 'react';
import * as CheckboxRadix from '@radix-ui/react-checkbox';
import { type CheckboxProps as CheckboxRadixProps } from '@radix-ui/react-checkbox';

import { getCheckboxVariant, type CheckboxVariants } from './Checkbox.theme';
import { CheckIcon } from 'components/shared/CustomIcon';

interface CheckBoxProps extends CheckboxRadixProps, CheckboxVariants {
  /**
   * The label of the checkbox.
   */
  label?: string;
  /**
   * The description of the checkbox.
   */
  description?: string;
}

/**
 * Checkbox component is used to allow users to select one or more items from a set.
 * It is a wrapper around the `@radix-ui/react-checkbox` component.
 *
 * It accepts all the props from `@radix-ui/react-checkbox` component and the variants from the theme.
 *
 * It also accepts `label` and `description` props to display the label and description of the checkbox.
 *
 * @example
 * ```tsx
 * <Checkbox
 *  id="checkbox"
 *  label="Checkbox"
 *  description="This is a checkbox"
 * />
 * ```
 */
export const Checkbox = ({
  id,
  className,
  label,
  description,
  onCheckedChange,
  ...props
}: CheckBoxProps) => {
  const {
    wrapper: wrapperStyle,
    indicator: indicatorStyle,
    icon: iconStyle,
    input: inputStyle,
    label: labelStyle,
    description: descriptionStyle,
  } = getCheckboxVariant({
    disabled: props?.disabled,
  });
  return (
    <div className={wrapperStyle()}>
      <CheckboxRadix.Root
        {...props}
        className={inputStyle({ className })}
        id={id}
        onCheckedChange={onCheckedChange}
      >
        <CheckboxRadix.Indicator forceMount className={indicatorStyle()}>
          <CheckIcon className={iconStyle()} />
        </CheckboxRadix.Indicator>
      </CheckboxRadix.Root>
      {label && (
        <label className={labelStyle()} htmlFor={id}>
          {label}
          {description && (
            <span className={descriptionStyle()}>{description}</span>
          )}
        </label>
      )}
    </div>
  );
};
