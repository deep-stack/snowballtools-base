import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const CalendarIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 0C5.55228 0 6 0.447715 6 1V2H12V1C12 0.447715 12.4477 0 13 0C13.5523 0 14 0.447715 14 1V2H16C17.1046 2 18 2.89543 18 4V17C18 18.1046 17.1046 19 16 19H2C0.89543 19 0 18.1046 0 17V4C0 2.89543 0.895431 2 2 2H4V1C4 0.447715 4.44772 0 5 0ZM2 9V17H16V9H2Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};
