import React from 'react';
import { Trigger, type TooltipTriggerProps } from '@radix-ui/react-tooltip';

export type TriggerProps = TooltipTriggerProps;

export const TooltipTrigger = ({ children, ...props }: TriggerProps) => {
  return (
    <Trigger asChild {...props}>
      {children}
    </Trigger>
  );
};
