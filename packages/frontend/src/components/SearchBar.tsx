import React, { forwardRef, RefAttributes } from 'react';

import { SearchIcon } from './shared/CustomIcon';
import { Input, InputProps } from './shared/Input';

const SearchBar: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps & RefAttributes<HTMLInputElement>
> = ({ value, onChange, placeholder = 'Search', ...props }) => {
  return (
    <div className="relative flex w-full">
      <Input
        leftIcon={<SearchIcon />}
        onChange={onChange}
        value={value}
        type="search"
        placeholder={placeholder}
        appearance="borderless"
        className="w-full lg:w-[459px]"
        {...props}
      />
    </div>
  );
};

export default forwardRef(SearchBar);
