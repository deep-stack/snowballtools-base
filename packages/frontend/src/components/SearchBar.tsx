import React, { ChangeEventHandler, forwardRef } from 'react';

import { Input } from '@material-tailwind/react';

interface SearchBarProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  placeholder?: string;
}

const SearchBar: React.ForwardRefRenderFunction<
  HTMLInputElement,
  SearchBarProps
> = ({ value, onChange, placeholder = 'Search', ...props }, ref) => {
  return (
    <div className="relative flex w-full gap-2">
      <Input
        variant="standard"
        onChange={onChange}
        value={value}
        type="search"
        placeholder={placeholder}
        containerProps={{
          className: 'min-w-[288px]',
        }}
        className="pl-9 placeholder:text-blue-gray-300 focus:!border-blue-gray-300"
        labelProps={{
          className: 'before:content-none after:content-none',
        }}
        // TODO: Debug issue: https://github.com/creativetimofficial/material-tailwind/issues/427
        crossOrigin={undefined}
        ref={ref}
        {...props}
      />
      <div className="!absolute left-3 top-[13px]">
        <i>^</i>
      </div>
    </div>
  );
};

export default forwardRef(SearchBar);
