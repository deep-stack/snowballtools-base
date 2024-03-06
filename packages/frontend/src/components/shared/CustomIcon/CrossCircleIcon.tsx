import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const CrossCircleIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9ZM7.01516 6.48484C6.86872 6.33839 6.63128 6.33839 6.48484 6.48484C6.33839 6.63128 6.33839 6.86872 6.48484 7.01516L8.46967 9L6.48484 10.9848C6.33839 11.1313 6.33839 11.3687 6.48484 11.5152C6.63128 11.6616 6.86872 11.6616 7.01516 11.5152L9 9.53033L10.9848 11.5152C11.1313 11.6616 11.3687 11.6616 11.5152 11.5152C11.6616 11.3687 11.6616 11.1313 11.5152 10.9848L9.53033 9L11.5152 7.01516C11.6616 6.86872 11.6616 6.63128 11.5152 6.48484C11.3687 6.33839 11.1313 6.33839 10.9848 6.48484L9 8.46967L7.01516 6.48484Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};
