import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const MenuIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M2 4.5C2 4.22386 2.22386 4 2.5 4H18.5C18.7761 4 19 4.22386 19 4.5C19 4.77614 18.7761 5 18.5 5H2.5C2.22386 5 2 4.77614 2 4.5Z"
        fill="currentColor"
      />
      <path
        d="M2 10.5C2 10.2239 2.22386 10 2.5 10H10.5C10.7761 10 11 10.2239 11 10.5C11 10.7761 10.7761 11 10.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z"
        fill="currentColor"
      />
      <path
        d="M2 16.5C2 16.2239 2.22386 16 2.5 16H18.5C18.7761 16 19 16.2239 19 16.5C19 16.7761 18.7761 17 18.5 17H2.5C2.22386 17 2 16.7761 2 16.5Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};
