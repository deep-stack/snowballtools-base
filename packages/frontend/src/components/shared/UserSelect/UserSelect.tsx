import React, {
  useState,
  ComponentPropsWithoutRef,
  useRef,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelect } from 'downshift';
import { UserSelectTheme, userSelectTheme } from './UserSelect.theme';
import { EmptyUserSelectItem, UserSelectItem } from './UserSelectItem';
import {
  BuildingIcon,
  ChevronUpDown,
  SettingsSlidersIcon,
} from 'components/shared/CustomIcon';
import { WavyBorder } from 'components/shared/WavyBorder';
import { cn } from 'utils/classnames';

export type UserSelectOption = {
  value: string;
  label: string;
  imgSrc?: string;
};

interface UserSelectProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'value' | 'onChange'>,
    UserSelectTheme {
  options: UserSelectOption[];
  value?: UserSelectOption;
}

export const UserSelect = ({ options, value }: UserSelectProps) => {
  const theme = userSelectTheme();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState<UserSelectOption | null>(
    (value as UserSelectOption) || null,
  );
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
    setSelectedItem(value as UserSelectOption);
  }, [value]);

  const handleSelectedItemChange = (selectedItem: UserSelectOption | null) => {
    setSelectedItem(selectedItem);
    navigate(`/${selectedItem?.value}`);
  };

  const isSelected = (item: UserSelectOption) =>
    selectedItem?.value === item.value;

  const {
    isOpen,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useSelect({
    items: options,
    // @ts-expect-error – there are two params but we don't need the second one
    isItemDisabled: (item) => item.disabled,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        handleSelectedItemChange(selectedItem);
      }
    },
    onIsOpenChange: ({ isOpen }) => {
      setDropdownOpen(isOpen ?? false);
    },
    itemToString: (item) => (item ? item.label : ''),
  });

  const handleManage = () => {
    //TODO: implement manage handler
  };

  return (
    <div className={theme.container()}>
      {/* Input */}
      <div
        {...getToggleButtonProps({
          ref: inputWrapperRef,
          suppressRefError: true,
        })}
        ref={inputWrapperRef}
        onClick={() => !dropdownOpen && openMenu()}
        className="cursor-pointer relative py-2 pl-2 pr-4 flex min-w-[200px] w-full items-center justify-between rounded-xl bg-surface-card shadow-sm"
      >
        <div className="flex gap-3 w-full mr-2">
          <img
            src={selectedItem?.imgSrc || '/logo.svg'}
            alt="Snowball Logo"
            className="h-10 w-10 rounded-lg"
          />
          <div className="flex flex-col justify-center h-10 w-full">
            {selectedItem?.label ? (
              <p className="text-sm text-elements-high-em">
                {selectedItem?.label}
              </p>
            ) : (
              <div className="animate-pulse h-1.5 mb-1 w-full rounded-full bg-elements-on-disabled" />
            )}
            <p className="text-xs text-elements-low-em">Team</p>
          </div>
        </div>

        <div className="h-4 w-4 text-slate-400">
          <ChevronUpDown size={16} />
        </div>
      </div>

      {/* Popover */}
      <ul
        {...getMenuProps({ ref: popoverRef }, { suppressRefError: true })}
        id="popover"
        ref={popoverRef}
        className={cn(theme.popover({ isOpen }), {
          // Position the popover based on the dropdown position
          'top-[27.5%]': dropdownPosition === 'bottom',
          'bottom-[92.5%]': dropdownPosition === 'top',
        })}
      >
        <div className={theme.popoverItemWrapper()}>
          {/* Settings header */}
          <div className="flex justify-between h-8 items-center">
            <div className="flex gap-1 text-elements-mid-em">
              <BuildingIcon size={16} />
              <p className="text-xs font-medium">Other teams</p>
            </div>
            <div
              className="flex gap-1 text-elements-link cursor-pointer"
              onClick={handleManage}
            >
              <p className="text-xs font-medium">Manage</p>
              <SettingsSlidersIcon size={16} />
            </div>
          </div>

          {/* Organization */}
          {isOpen && options.length !== 0 ? (
            options.map((item, index) => (
              <UserSelectItem
                {...getItemProps({ item, index })}
                key={item.value}
                selected={isSelected(item)}
                option={item}
                hovered={highlightedIndex === index}
              />
            ))
          ) : (
            <EmptyUserSelectItem />
          )}
        </div>

        {/* WavyBorder */}
        {/* //TODO:remove if personal dont exist */}
        <WavyBorder />

        <div className={theme.popoverItemWrapper()}>
          {/* //TODO:Personal (replace options with Personal Options) */}
          {isOpen && options.length !== 0 ? (
            options.map((item, index) => (
              <UserSelectItem
                {...getItemProps({ item, index: 99 })}
                key={item.value}
                selected={isSelected(item)}
                option={item}
                hovered={highlightedIndex === index}
              />
            ))
          ) : (
            <EmptyUserSelectItem />
          )}
        </div>
      </ul>
    </div>
  );
};
