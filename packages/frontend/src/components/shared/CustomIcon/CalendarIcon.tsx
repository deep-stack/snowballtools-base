import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const CalendarIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M2.625 7.125H15.375M5.625 3.375V1.875M12.375 3.375V1.875M4.125 15.375H13.875C14.7034 15.375 15.375 14.7034 15.375 13.875V4.875C15.375 4.04657 14.7034 3.375 13.875 3.375H4.125C3.29657 3.375 2.625 4.04657 2.625 4.875V13.875C2.625 14.7034 3.29657 15.375 4.125 15.375Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
