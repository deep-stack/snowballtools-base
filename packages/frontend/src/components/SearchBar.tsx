import React, { forwardRef, RefAttributes } from 'react';

import { Input, InputProps } from '@material-tailwind/react';

const SearchBar: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps & RefAttributes<HTMLInputElement>
> = ({ value, onChange, placeholder = 'Search', ...props }, ref) => {
  return (
    <div className="relative flex w-full gap-2">
      <Input
        onChange={onChange}
        value={value}
        type="search"
        placeholder={placeholder}
        containerProps={{
          className: 'min-w-[288px]',
        }}
        className="!border-t-blue-gray-300 pl-9 placeholder:text-blue-gray-300 focus:!border-blue-gray-300"
        labelProps={{
          className: 'before:content-none after:content-none',
        }}
        // TODO: Debug issue: https://github.com/creativetimofficial/material-tailwind/issues/427
        crossOrigin={undefined}
        {...props}
        inputRef={ref}
      />
      <div className="!absolute left-3 top-[13px]">
        <i>^</i>
      </div>
    </div>
  );
};

export default forwardRef(SearchBar);
