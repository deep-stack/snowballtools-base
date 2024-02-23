import React from 'react';
import {
  Root as RadixRoot,
  RadioGroupProps,
} from '@radix-ui/react-radio-group';
import { RadioTheme, radioTheme } from './Radio.theme';
import { RadioItem, RadioItemProps } from './RadioItem';

export interface RadioOption extends RadioItemProps {
  /**
   * The label of the radio option.
   */
  label: string;
  /**
   * The value of the radio option.
   */
  value: string;
}

export interface RadioProps extends RadioGroupProps, RadioTheme {
  /**
   * The options of the radio.
   * @default []
   * @example
   * ```tsx
   * const options = [
   *  {
   *    label: 'Label 1',
   *    value: '1',
   *  },
   *  {
   *    label: 'Label 2',
   *    value: '2',
   *  },
   *  {
   *    label: 'Label 3',
   *    value: '3',
   *  },
   * ];
   * ```
   */
  options: RadioOption[];
}

/**
 * The Radio component is used to select one option from a list of options.
 */
export const Radio = ({
  className,
  options,
  orientation,
  ...props
}: RadioProps) => {
  const { root } = radioTheme({ orientation });

  return (
    <RadixRoot {...props} className={root({ className })}>
      {options.map((option) => (
        <RadioItem key={option.value} {...option} />
      ))}
    </RadixRoot>
  );
};
