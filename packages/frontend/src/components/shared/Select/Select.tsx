import React, {
  ReactNode,
  useState,
  ComponentPropsWithoutRef,
  useMemo,
  useCallback,
  MouseEvent,
  useRef,
  useEffect,
} from 'react';
import { useMultipleSelection, useCombobox } from 'downshift';
import { SelectTheme, selectTheme } from './Select.theme';
import {
  ChevronDownIcon,
  CrossIcon,
  WarningIcon,
} from 'components/shared/CustomIcon';
import { cloneIcon } from 'utils/cloneIcon';
import { cn } from 'utils/classnames';
import { SelectItem, EmptySelectItem } from './SelectItem';
import { SelectValue } from './SelectValue';

export type SelectOption = {
  /**
   * The value of the option
   */
  value: string;
  /**
   * The label of the option
   */
  label: string;
  /**
   * The description of the option
   */
  description?: string;
  /**
   * Custom left icon for the option
   */
  leftIcon?: ReactNode;
  /**
   * Custom right icon for the option
   */
  rightIcon?: ReactNode;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
};

/**
 * The orientation of the select
 */
export type SelectOrientation = 'horizontal' | 'vertical';

interface SelectProps
  extends Omit<
      ComponentPropsWithoutRef<'input'>,
      'size' | 'value' | 'onChange'
    >,
    SelectTheme {
  /**
   * The options of the select
   */
  options: SelectOption[];
  /**
   * The label of the select
   */
  label?: string;
  /**
   * The description of the select
   */
  description?: string;
  /**
   * Wheter the select is multiple or not
   */
  multiple?: boolean;
  /**
   * Wheter the select is searchable or not
   */
  searchable?: boolean;
  /**
   * Wheter the select is clearable or not
   */
  clearable?: boolean;
  /**
   * Custom left icon for the select
   */
  leftIcon?: ReactNode;
  /**
   * Custom right icon for the select
   */
  rightIcon?: ReactNode;
  /**
   * The helper text of the select
   */
  helperText?: string;
  /**
   * Show the values of the select if it's multiple
   */
  hideValues?: boolean;
  /**
   * The value of the select
   */
  value?: SelectOption | SelectOption[];
  /**
   * Callback function when reset the select
   */
  onClear?: () => void;
  /**
   * Callback function when the value of the select changes
   */
  onChange?: (value: SelectOption | SelectOption[]) => void;
}

export const Select = ({
  options,
  multiple = false,
  searchable = false,
  clearable,
  size,
  error,
  orientation = 'horizontal',
  variant,
  label,
  description,
  leftIcon,
  rightIcon,
  helperText,
  hideValues = false,
  placeholder: placeholderProp = 'Select an option',
  value,
  onChange,
  onClear,
}: SelectProps) => {
  const theme = selectTheme({ size, error, variant, orientation });

  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState<SelectOption | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const popoverRef = useRef(null); // Ref for the popover
  const inputWrapperRef = useRef(null); // Ref for the input wrapper

  // Calculate and update popover position
  useEffect(() => {
    if (dropdownOpen && popoverRef.current && inputWrapperRef.current) {
      const popover = popoverRef.current;
      // @ts-expect-error – we know it's not null lol
      const input = inputWrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - input.bottom;
      const spaceAbove = input.top;
      // @ts-expect-error – we know it's not null lol
      const popoverHeight = popover.offsetHeight;

      // Determine if there's enough space below
      if (spaceBelow >= popoverHeight) {
        setDropdownPosition('bottom');
      } else if (spaceAbove >= popoverHeight) {
        setDropdownPosition('top');
      } else {
        // Default to bottom if neither has enough space, but you could also set logic to choose the side with more space
        setDropdownPosition('bottom');
      }
    }
  }, [dropdownOpen]); // Re-calculate whenever the dropdown is opened

  useEffect(() => {
    // If multiple selection is enabled, ensure the internal state is an array
    if (multiple) {
      if (Array.isArray(value)) {
        // Directly use the provided array
        setSelectedItems(value);
      } else {
        // Reset or set to empty array if the value is not an array
        setSelectedItems([]);
      }
    } else {
      // For single selection, directly set the selected item
      setSelectedItem(value as SelectOption);
    }
  }, [value, multiple]);

  const handleSelectedItemChange = (selectedItem: SelectOption | null) => {
    setSelectedItem(selectedItem);
    setInputValue(selectedItem ? selectedItem.label : '');
    onChange?.(selectedItem as SelectOption);
  };

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
    setSelectedItems,
    reset,
  } = useMultipleSelection<SelectOption>({
    onSelectedItemsChange: multiple
      ? undefined
      : ({ selectedItems }) => {
          handleSelectedItemChange(selectedItems?.[0] || null);
        },
  });

  const filteredItems = useMemo(() => {
    // Show all items if the dropdown is not multiple and not searchable
    if (!multiple && !searchable) return options;
    // Show only the items that match the input value
    if (!multiple && searchable) {
      return options.filter((item) =>
        item.label.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }
    // Show only the items that match the input value and are not already selected
    return options.filter(
      (item) =>
        item.label.toLowerCase().includes(inputValue.toLowerCase()) &&
        !(
          multiple && searchable // If the dropdown is multiple and searchable, show filtered items
            ? selectedItems
            : []
        ).includes(item),
    );
  }, [options, inputValue, selectedItem, selectedItems, multiple, searchable]);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useCombobox({
    items: filteredItems,
    // @ts-expect-error – there are two params but we don't need the second one
    isItemDisabled: (item) => item.disabled,
    onInputValueChange: ({ inputValue = '' }) => setInputValue(inputValue),
    onSelectedItemChange: ({ selectedItem }) => {
      if (!multiple && selectedItem) {
        handleSelectedItemChange(selectedItem);
      } else if (multiple && selectedItem) {
        // If the item is not already selected, add it to the selected items
        if (!selectedItems.includes(selectedItem)) {
          addSelectedItem(selectedItem);
          // Callback for `onChange`
          const newSelectedItems = [...selectedItems, selectedItem];
          onChange?.(newSelectedItems);
        } else {
          // If the item is already selected, remove it from the selected items
          removeSelectedItem(selectedItem);
          // Callback for `onChange`
          const newSelectedItems = selectedItems.filter(
            (item) => selectedItem !== item,
          );
          onChange?.(newSelectedItems);
        }
        setInputValue('');
      }
    },
    onIsOpenChange: ({ isOpen }) => {
      setDropdownOpen(isOpen ?? false);
      if (isOpen && !multiple && selectedItem && searchable) {
        setInputValue('');
      }
    },
    selectedItem: multiple ? null : selectedItem,
    // TODO: Make the input value empty when the dropdown is open, has a value, it is not multiple, and searchable
    itemToString: (item) => (item && !multiple ? item.label : ''),
  });

  const isSelected = useCallback(
    (item: SelectOption) =>
      multiple ? selectedItems.includes(item) : selectedItem === item,
    [selectedItems, selectedItem, multiple],
  );

  const handleClear = (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    reset();
    setSelectedItem(null);
    setInputValue('');
    onClear?.();
  };

  const renderLabels = useMemo(() => {
    if (!label && !description) return null;
    return (
      <div className="flex flex-col gap-y-1">
        <p className={theme.label()}>{label}</p>
        <p className={theme.description()}>{description}</p>
      </div>
    );
  }, [theme, label, description]);

  const renderLeftIcon = useMemo(() => {
    return (
      <div className={theme.iconContainer({ class: 'left-0 pl-4' })}>
        {cloneIcon(leftIcon, { className: theme.icon(), 'aria-hidden': true })}
      </div>
    );
  }, [cloneIcon, theme, leftIcon]);

  const renderRightIcon = useMemo(() => {
    return (
      <div className={theme.iconContainer({ class: 'pr-4 right-0' })}>
        {clearable && (selectedItems.length > 0 || selectedItem) && (
          <CrossIcon
            className={theme.icon({ class: 'h-4 w-4' })}
            onClick={handleClear}
          />
        )}
        {rightIcon ? (
          cloneIcon(rightIcon, { className: theme.icon(), 'aria-hidden': true })
        ) : (
          <ChevronDownIcon className={theme.icon()} />
        )}
      </div>
    );
  }, [cloneIcon, theme, rightIcon]);

  const renderHelperText = useMemo(() => {
    if (!helperText) return null;
    return (
      <div className={theme.helperText()}>
        {error &&
          cloneIcon(<WarningIcon className={theme.helperIcon()} />, {
            'aria-hidden': true,
          })}
        <p>{helperText}</p>
      </div>
    );
  }, [cloneIcon, error, theme, helperText]);

  const isMultipleHasValue = multiple && selectedItems.length > 0;
  const isMultipleHasValueButNotSearchable =
    multiple && !searchable && selectedItems.length > 0;
  const displayPlaceholder = useMemo(() => {
    if (hideValues && isMultipleHasValue) {
      return `${selectedItems.length} selected`;
    }
    if (isMultipleHasValueButNotSearchable) {
      return '';
    }
    return placeholderProp;
  }, [hideValues, multiple, selectedItems.length, placeholderProp]);

  return (
    <div className={theme.container()}>
      {/* Label & description */}
      {renderLabels}

      {/* Input */}
      <div
        ref={inputWrapperRef}
        className={theme.inputWrapper({
          hasValue: isMultipleHasValue && !hideValues,
        })}
        onClick={() => !dropdownOpen && openMenu()}
      >
        {/* Left icon */}
        {leftIcon && renderLeftIcon}

        {/* Multiple input values */}
        {isMultipleHasValue &&
          !hideValues &&
          selectedItems.map((item, index) => (
            <SelectValue
              key={`selected-item-${index}`}
              {...getSelectedItemProps({ selectedItem: item, index })}
              option={item}
              size={size}
              onDelete={removeSelectedItem}
            />
          ))}

        {/* Single input value or searchable area */}
        <input
          {...getInputProps(getDropdownProps())}
          placeholder={displayPlaceholder}
          // Control readOnly based on searchable
          readOnly={!searchable || hideValues}
          className={cn(
            theme.input({
              searchable,
              hideValues: hideValues && selectedItems.length > 0,
            }),
            {
              // Make the input width smaller because we don't need it (not searchable)
              'w-6': isMultipleHasValueButNotSearchable && !hideValues,
              // Add margin to the X icon
              'ml-6': isMultipleHasValueButNotSearchable && clearable,
            },
          )}
        />

        {/* Right icon */}
        {renderRightIcon}
      </div>

      {/* Helper text */}
      {renderHelperText}

      {/* Popover */}
      <ul
        {...getMenuProps({ ref: popoverRef }, { suppressRefError: true })}
        id="popover"
        ref={popoverRef}
        className={cn(theme.popover({ isOpen }), {
          // Position the popover based on the dropdown position
          'top-[27.5%]': dropdownPosition === 'bottom' && !label,
          'top-[35%]': dropdownPosition === 'bottom' && label,
          'top-[42.5%]': dropdownPosition === 'bottom' && label && description,
          'bottom-[92.5%]': dropdownPosition === 'top' && !label,
          'bottom-[75%]': dropdownPosition === 'top' && label,
          'bottom-[65%]': dropdownPosition === 'top' && label && description,
        })}
      >
        {isOpen && filteredItems.length !== 0 ? (
          filteredItems.map((item, index) => (
            <SelectItem
              {...getItemProps({ item, index })}
              key={item.value}
              selected={isSelected(item)}
              option={item}
              hovered={highlightedIndex === index}
              orientation={orientation}
              variant={variant}
            />
          ))
        ) : (
          <EmptySelectItem />
        )}
      </ul>
    </div>
  );
};
