import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const TrendingIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M1.875 9.79623L2.68636 7.88111C2.95597 7.24472 3.86788 7.28002 4.08767 7.93535L5.09939 10.9518C5.33069 11.6415 6.30748 11.6322 6.52567 10.9383L8.97436 3.15067C9.2032 2.42289 10.2437 2.46059 10.4194 3.20303L13.1643 14.7969C13.3368 15.5254 14.3502 15.5807 14.6007 14.8754L16.125 10.583"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
