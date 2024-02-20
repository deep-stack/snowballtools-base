import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const ChevronGrabberHorizontal = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M6.66666 12.5L9.99999 15.8333L13.3333 12.5M6.66666 7.5L9.99999 4.16666L13.3333 7.5"
        stroke="currentColor"
        strokeLinecap="square"
      />
    </CustomIcon>
  );
};
