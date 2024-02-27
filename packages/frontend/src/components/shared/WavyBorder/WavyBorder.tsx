import React, { ComponentPropsWithoutRef } from 'react';
import { cn } from 'utils/classnames';

export interface WavyBorderProps extends ComponentPropsWithoutRef<'div'> {}

export const WavyBorder = ({
  className,
  children,
  ...props
}: WavyBorderProps) => {
  return (
    <div {...props} className={cn('wave', className)}>
      {children}
    </div>
  );
};
