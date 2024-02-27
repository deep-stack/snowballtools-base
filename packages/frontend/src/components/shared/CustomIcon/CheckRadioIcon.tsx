import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const CheckRadioIcon = (props: CustomIconProps) => {
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
        d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5ZM7.93079 12.3663L12.3055 7.01944L11.1446 6.06958L7.81944 10.1336L6.37511 8.68932L5.31445 9.74998L7.93079 12.3663Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};
