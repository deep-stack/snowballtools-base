import React, { forwardRef, ComponentPropsWithoutRef, useMemo } from 'react';
import { Overwrite, UseComboboxGetItemPropsReturnValue } from 'downshift';
import { SelectOption, SelectOrientation } from 'components/shared/Select';
import { selectItemTheme, SelectItemTheme } from './SelectItem.theme';
import { cloneIcon } from 'utils/cloneIcon';
import { cn } from 'utils/classnames';
import { CheckRadioIcon } from 'components/shared/CustomIcon';
import { OmitCommon } from 'types/common';

/**
 * Represents a type that merges ComponentPropsWithoutRef<'li'> with certain exclusions.
 * @type {MergedComponentPropsWithoutRef}
 */
type MergedComponentPropsWithoutRef = OmitCommon<
  ComponentPropsWithoutRef<'li'>,
  Omit<
    Overwrite<UseComboboxGetItemPropsReturnValue, SelectOption[]>,
    'index' | 'item'
  >
>;

export interface SelectItemProps
  extends MergedComponentPropsWithoutRef,
    SelectItemTheme {
  selected: boolean;
  option: SelectOption;
  orientation?: SelectOrientation;
  hovered?: boolean;
}

const SelectItem = forwardRef<HTMLLIElement, SelectItemProps>(
  (
    { className, selected, orientation, hovered, variant, option, ...props },
    ref,
  ) => {
    const theme = selectItemTheme({ active: hovered, orientation, variant });

    const { label, description, leftIcon, rightIcon, disabled } = option;

    const renderRightIcon = useMemo(() => {
      if (rightIcon) {
        return cloneIcon(rightIcon, { className: theme.icon() });
      } else if (selected) {
        return (
          <CheckRadioIcon
            className={cn(theme.icon(), 'text-controls-primary')}
          />
        );
      }
      return null;
    }, [rightIcon, theme, cloneIcon, cn, selected]);

    return (
      <li
        {...props}
        ref={ref}
        className={theme.wrapper({ className })}
        data-disabled={disabled}
      >
        {leftIcon && cloneIcon(leftIcon, { className: theme.icon() })}
        <div className={theme.content()}>
          <p className={theme.label()} data-disabled={disabled}>
            {label}
          </p>
          {orientation === 'horizontal' && description && (
            <span className={theme.dot()} />
          )}
          {description && (
            <p className={theme.description()} data-disabled={disabled}>
              {description}
            </p>
          )}
        </div>
        {renderRightIcon}
      </li>
    );
  },
);

SelectItem.displayName = 'SelectItem';

/**
 * Represents an empty select item.
 * @returns {JSX.Element} - A JSX element representing the empty select item.
 */
export const EmptySelectItem = () => {
  const theme = selectItemTheme();
  return (
    <li className={theme.wrapper()}>
      <p className={theme.label({ class: 'text-elements-disabled' })}>
        No results found
      </p>
    </li>
  );
};

export { SelectItem };
