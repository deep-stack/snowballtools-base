import type {
  TooltipContentProps,
  TooltipTriggerProps,
} from '@radix-ui/react-tooltip';
import { ReactNode, useState } from 'react';

import { TooltipBase, type TooltipBaseProps } from './TooltipBase';

export interface TooltipProps extends TooltipBaseProps {
  triggerProps?: TooltipTriggerProps;
  contentProps?: TooltipContentProps;
  content?: ReactNode;
}

// https://github.com/radix-ui/primitives/issues/955#issuecomment-1798201143
// Wrap on top of Tooltip base to make tooltip open on mobile via click
export const Tooltip = ({
  children,
  triggerProps,
  contentProps,
  content,
  ...props
}: TooltipProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <TooltipBase
      open={isTooltipVisible}
      onOpenChange={setIsTooltipVisible}
      {...props}
    >
      <TooltipBase.Trigger
        asChild
        onBlur={() => setIsTooltipVisible(false)}
        onClick={() => setIsTooltipVisible((prevOpen) => !prevOpen)}
        onFocus={() => setTimeout(() => setIsTooltipVisible(true), 0)}
        {...triggerProps}
      >
        {triggerProps?.children ?? children}
      </TooltipBase.Trigger>
      <TooltipBase.Content {...contentProps}>
        {content ?? contentProps?.children ?? 'Coming soon'}
      </TooltipBase.Content>
    </TooltipBase>
  );
};
