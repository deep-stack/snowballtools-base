import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const ChevronRight = (props: CustomIconProps) => {
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
        d="M6.00001 1.95956L12.0405 7.99998L6.00001 14.0404L5.29291 13.3333L10.6262 7.99999L5.29291 2.66666L6.00001 1.95956Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};
