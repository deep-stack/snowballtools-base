import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const FolderIcon = (props: CustomIconProps) => {
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
        d="M2.0835 4.58341V14.5834C2.0835 15.5039 2.82969 16.2501 3.75016 16.2501H16.2502C17.1706 16.2501 17.9168 15.5039 17.9168 14.5834V7.08341C17.9168 6.16294 17.1706 5.41675 16.2502 5.41675H10.8921C10.3349 5.41675 9.81449 5.13825 9.50539 4.67458L8.82827 3.65891C8.51916 3.19525 7.99878 2.91675 7.44152 2.91675H3.75016C2.82969 2.91675 2.0835 3.66294 2.0835 4.58341Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
