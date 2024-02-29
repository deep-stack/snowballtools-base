import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const CursorBoxIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        d="M13.5 7V3.83333C13.5 3.09695 12.903 2.5 12.1667 2.5H3.83333C3.09695 2.5 2.5 3.09695 2.5 3.83333V12.1667C2.5 12.903 3.09695 13.5 3.83333 13.5H7M9.43391 14.0852L7.5218 7.9391C7.44202 7.68269 7.68269 7.44202 7.9391 7.5218L14.0852 9.43391C14.3658 9.52122 14.4043 9.90262 14.1468 10.0443L11.5848 11.4534C11.5294 11.4838 11.4838 11.5294 11.4534 11.5848L10.0443 14.1468C9.90262 14.4043 9.52122 14.3658 9.43391 14.0852Z"
        stroke="currentColor"
        strokeWidth="1.05263"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
