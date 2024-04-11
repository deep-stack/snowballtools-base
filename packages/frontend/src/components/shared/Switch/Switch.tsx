import { type ComponentPropsWithoutRef } from 'react';
import { type SwitchProps as SwitchRadixProps } from '@radix-ui/react-switch';
import * as SwitchRadix from '@radix-ui/react-switch';

import { switchTheme, type SwitchVariants } from './Switch.theme';

interface SwitchProps
  extends Omit<SwitchRadixProps, 'checked'>,
    SwitchVariants {
  /**
   * The label of the switch.
   */
  label?: string;
  /**
   * The description of the switch.
   */
  description?: string;
  /**
   * Custom wrapper props for the switch.
   */
  wrapperProps?: ComponentPropsWithoutRef<'div'>;
  /**
   * Function that is called when the checked state of the switch changes.
   * @param checked The new checked state of the switch.
   */
  onCheckedChange?(checked: boolean): void;
}

/**
 * A switch is a component used for toggling between two states.
 */
export const Switch = ({
  className,
  checked,
  label,
  description,
  disabled,
  name,
  wrapperProps,
  fullWidth,
  ...props
}: SwitchProps) => {
  const {
    wrapper,
    switch: switchClass,
    thumb,
    label: labelClass,
    description: descriptionClass,
  } = switchTheme({
    checked,
    disabled,
    fullWidth,
  });

  const switchComponent = (
    <SwitchRadix.Root
      {...props}
      checked={checked}
      disabled={disabled}
      className={switchClass({ className })}
    >
      <SwitchRadix.Thumb className={thumb()} />
    </SwitchRadix.Root>
  );

  // If a label is provided, wrap the switch in a label element.
  if (label) {
    return (
      <div
        {...wrapperProps}
        className={wrapper({ className: wrapperProps?.className })}
      >
        <label className={labelClass()} htmlFor={name}>
          {label}
          {description && (
            <span className={descriptionClass()}>{description}</span>
          )}
        </label>
        {switchComponent}
      </div>
    );
  }

  return switchComponent;
};
