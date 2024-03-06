import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const CheckRoundFilledIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon width="20" height="20" viewBox="0 0 20 20" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM13.774 8.13327C14.1237 7.70582 14.0607 7.0758 13.6332 6.72607C13.2058 6.37635 12.5758 6.43935 12.226 6.86679L8.42576 11.5116L7.20711 10.2929C6.81658 9.9024 6.18342 9.9024 5.79289 10.2929C5.40237 10.6834 5.40237 11.3166 5.79289 11.7071L7.79289 13.7071C7.99267 13.9069 8.26764 14.0129 8.54981 13.9988C8.83199 13.9847 9.09505 13.8519 9.27396 13.6333L13.774 8.13327Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};
