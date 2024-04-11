import {
  default as ReactDropdown,
  Option as ReactDropdownOption,
} from 'react-dropdown';
import 'react-dropdown/style.css';

export interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  onChange: (arg: ReactDropdownOption) => void;
  placeholder?: string;
  value?: Option;
}

const Dropdown = ({ placeholder, options, onChange, value }: DropdownProps) => {
  return (
    <ReactDropdown
      options={options}
      placeholder={placeholder}
      className="h-full"
      controlClassName="h-full"
      onChange={onChange}
      value={value}
    />
  );
};

export default Dropdown;
