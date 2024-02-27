import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const ArrowRightCircleIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.3333 8C15.3333 4.3181 12.3486 1.33333 8.66667 1.33333C4.98477 1.33333 2 4.3181 2 8C2 11.6819 4.98477 14.6667 8.66667 14.6667C12.3486 14.6667 15.3333 11.6819 15.3333 8ZM10.2929 8.5L8.97978 9.81311C8.78452 10.0084 8.78452 10.325 8.97978 10.5202C9.17504 10.7155 9.49162 10.7155 9.68689 10.5202L11.3821 8.82495C11.8378 8.36934 11.8378 7.63065 11.3821 7.17504L9.68689 5.47977C9.49162 5.28451 9.17504 5.28451 8.97978 5.47977C8.78452 5.67504 8.78452 5.99162 8.97978 6.18688L10.2929 7.5H5.83333C5.55719 7.5 5.33333 7.72385 5.33333 8C5.33333 8.27614 5.55719 8.5 5.83333 8.5H10.2929Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};