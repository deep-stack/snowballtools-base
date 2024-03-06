import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const WarningTriangleIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M9.00004 6.75007V10.1251M7.71074 2.91845L2.09776 12.3585C1.50324 13.3583 2.22379 14.6251 3.38706 14.6251H14.613C15.7763 14.6251 16.4968 13.3583 15.9023 12.3585L10.2893 2.91844C9.70792 1.9406 8.29216 1.9406 7.71074 2.91845Z"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <circle cx="9" cy="12" r="0.5625" fill="currentColor" />
    </CustomIcon>
  );
};
