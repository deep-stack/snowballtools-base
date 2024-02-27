import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const NotificationBellIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        id="Icon"
        d="M13.3333 15.4166C12.7722 16.8882 11.4909 17.9166 9.99997 17.9166C8.50903 17.9166 7.22769 16.8882 6.66664 15.4166M4.80461 15.4166H15.1953C16.1978 15.4166 16.9735 14.5379 16.8491 13.5432L16.0885 7.45809C15.7047 4.38751 13.0944 2.08325 9.99997 2.08325C6.90549 2.08325 4.29527 4.38751 3.91145 7.45809L3.15081 13.5432C3.02647 14.5379 3.80211 15.4166 4.80461 15.4166Z"
        stroke="currentColor"
      />
    </CustomIcon>
  );
};
