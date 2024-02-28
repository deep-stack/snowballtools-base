import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const ChevronUpDown = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M8 15L12 19L16 15M8 9L12 5L16 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
