import React, { forwardRef, ComponentPropsWithoutRef } from 'react';
import { Overwrite, UseComboboxGetItemPropsReturnValue } from 'downshift';
import {
  userSelectItemTheme,
  UserSelectItemTheme,
} from './UserSelectItem.theme';
import { CheckRadioIcon } from 'components/shared/CustomIcon';
import { UserSelectOption } from 'components/shared/UserSelect';
import { OmitCommon } from 'types/common';

/**
 * Represents a type that merges ComponentPropsWithoutRef<'li'> with certain exclusions.
 * @type {MergedComponentPropsWithoutRef}
 */
type MergedComponentPropsWithoutRef = OmitCommon<
  ComponentPropsWithoutRef<'li'>,
  Omit<
    Overwrite<UseComboboxGetItemPropsReturnValue, UserSelectOption[]>,
    'index' | 'item'
  >
>;

export interface UserSelectItemProps
  extends MergedComponentPropsWithoutRef,
    UserSelectItemTheme {
  selected: boolean;
  option: UserSelectOption;
  hovered?: boolean;
}

const UserSelectItem = forwardRef<HTMLLIElement, UserSelectItemProps>(
  ({ className, selected, hovered, option, ...props }, ref) => {
    const theme = userSelectItemTheme();

    const { value, label, imgSrc = './logo.svg' } = option;

    return (
      <li
        {...props}
        ref={ref}
        className={theme.wrapper({ className, active: selected || hovered })}
      >
        <div className={theme.content()}>
          <img src={imgSrc} alt={`${value}-logo`} className={theme.img()} />
          <p className={theme.label()}>{label}</p>
        </div>
        {selected && <CheckRadioIcon className={theme.selectedIcon()} />}
      </li>
    );
  },
);

export const EmptyUserSelectItem = () => {
  const theme = userSelectItemTheme();
  return (
    <li className={theme.wrapper()}>
      <div className={theme.content()}>
        <p className={theme.label()}>No results found</p>
      </div>
    </li>
  );
};

UserSelectItem.displayName = 'UserSelectItem';

export { UserSelectItem };
