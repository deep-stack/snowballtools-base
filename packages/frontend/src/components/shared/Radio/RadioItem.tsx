import React, { ComponentPropsWithoutRef } from 'react';
import {
  Item as RadixRadio,
  Indicator as RadixIndicator,
  RadioGroupItemProps,
  RadioGroupIndicatorProps,
} from '@radix-ui/react-radio-group';
import { radioTheme } from './Radio.theme';

export interface RadioItemProps extends RadioGroupItemProps {
  /**
   * The wrapper props of the radio item.
   * You can use this prop to customize the wrapper props.
   */
  wrapperProps?: ComponentPropsWithoutRef<'div'>;
  /**
   * The label props of the radio item.
   * You can use this prop to customize the label props.
   */
  labelProps?: ComponentPropsWithoutRef<'label'>;
  /**
   * The indicator props of the radio item.
   * You can use this prop to customize the indicator props.
   */
  indicatorProps?: RadioGroupIndicatorProps;
  /**
   * The id of the radio item.
   */
  id?: string;
  /**
   * The label of the radio item.
   */
  label?: string;
}

/**
 * The RadioItem component is used to render a radio item.
 */
export const RadioItem = ({
  className,
  wrapperProps,
  labelProps,
  indicatorProps,
  label,
  id,
  ...props
}: RadioItemProps) => {
  const { wrapper, label: labelClass, radio, indicator } = radioTheme();

  // Generate a unique id for the radio item from the label if the id is not provided
  const kebabCaseLabel = label?.toLowerCase().replace(/\s+/g, '-');
  const componentId = id ?? kebabCaseLabel;

  return (
    <div className={wrapper({ className: wrapperProps?.className })}>
      <RadixRadio {...props} className={radio({ className })} id={componentId}>
        <RadixIndicator
          forceMount
          {...indicatorProps}
          className={indicator({ className: indicatorProps?.className })}
        />
      </RadixRadio>
      {label && (
        <label
          {...labelProps}
          className={labelClass({ className: labelProps?.className })}
          htmlFor={componentId}
        >
          {label}
        </label>
      )}
    </div>
  );
};
