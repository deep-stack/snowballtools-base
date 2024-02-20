import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const ChevronLeft = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7071 2.66666L5.37378 8.00001L10.7071 13.3333L10 14.0404L3.95956 8.00001L10 1.95956L10.7071 2.66666Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};
