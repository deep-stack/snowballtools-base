import { forwardRef, ComponentPropsWithoutRef } from 'react';
import {
  Overwrite,
  UseMultipleSelectionGetSelectedItemReturnValue,
} from 'downshift';
import { SelectValueTheme, selectValueTheme } from './SelectValue.theme';
import { OmitCommon } from 'types/common';
import { SelectOption } from 'components/shared/Select';
import { Button } from 'components/shared/Button';
import { CrossIcon } from 'components/shared/CustomIcon';

type MergedComponentPropsWithoutRef = OmitCommon<
  ComponentPropsWithoutRef<'span'>,
  Omit<
    Overwrite<UseMultipleSelectionGetSelectedItemReturnValue, SelectOption[]>,
    'index' | 'selectedItem'
  >
>;

export interface SelectValueProps
  extends MergedComponentPropsWithoutRef,
    SelectValueTheme {
  /**
   * The option of the select value
   */
  option: SelectOption;
  /**
   * The function to call when the delete button is clicked
   * @param item
   * @returns none;
   */
  onDelete?: (item: SelectOption) => void;
}

/**
 * The SelectValue component is used to display the selected value of a select component
 */
const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, size, option, onDelete, ...props }, ref) => {
    const theme = selectValueTheme();

    return (
      <span {...props} ref={ref} className={theme.wrapper({ className, size })}>
        {option.label}
        <Button
          onClick={() => onDelete?.(option)}
          iconOnly
          variant="unstyled"
          size="xs"
        >
          <CrossIcon className={theme.icon()} />
        </Button>
      </span>
    );
  },
);

SelectValue.displayName = 'SelectValue';

export { SelectValue };
