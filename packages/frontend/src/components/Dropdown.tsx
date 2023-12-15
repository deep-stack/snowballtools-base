import React from 'react';
import {
  default as ReactDropdown,
  Option as ReactDropdownOption,
} from 'react-dropdown';
import 'react-dropdown/style.css';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  placeholder: string;
  options: Option[];
  handler: (arg: ReactDropdownOption) => void;
}

const Dropdown = ({ placeholder, options, handler }: DropdownProps) => {
  return (
    <ReactDropdown
      options={options}
      placeholder={placeholder}
      className="h-full"
      controlClassName="h-full"
      onChange={handler}
    />
  );
};

export default Dropdown;
