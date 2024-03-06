import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const MinusCircleIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5 12C2.5 6.47715 6.97715 2 12.5 2C18.0228 2 22.5 6.47715 22.5 12C22.5 17.5228 18.0228 22 12.5 22C6.97715 22 2.5 17.5228 2.5 12ZM16.5 12.9999C17.0523 12.9999 17.5 12.5522 17.5 11.9999C17.5 11.4476 17.0523 10.9999 16.5 10.9999L8.49997 11.0001C7.94769 11.0001 7.49998 11.4479 7.5 12.0001C7.50002 12.5524 7.94774 13.0001 8.50003 13.0001L16.5 12.9999Z"
        fill="#0F86F5"
      />
    </CustomIcon>
  );
};
