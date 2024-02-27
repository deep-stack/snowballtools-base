import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';
import { EllipseIcon } from './EllipseIcon';

export const EllipsesIcon: React.FC<CustomIconProps> = (props) => {
  return (
    <CustomIcon width="51" height="8" viewBox="0 0 51 8" fill="none" {...props}>
      <EllipseIcon />
      <EllipseIcon x="14" />
      <EllipseIcon x="28" />
      <EllipseIcon x="42" />
    </CustomIcon>
  );
};
