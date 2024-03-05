import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const SearchIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M15.375 15.375L12.225 12.225M13.875 8.25C13.875 11.3566 11.3566 13.875 8.25 13.875C5.1434 13.875 2.625 11.3566 2.625 8.25C2.625 5.1434 5.1434 2.625 8.25 2.625C11.3566 2.625 13.875 5.1434 13.875 8.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
