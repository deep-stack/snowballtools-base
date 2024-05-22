import {
  Provider,
  TooltipProps as RadixTooltipProps,
  Root,
  type TooltipProviderProps,
} from '@radix-ui/react-tooltip';
import { useState, type PropsWithChildren } from 'react';

import { TooltipContent } from './TooltipContent';
import { TooltipTrigger } from './TooltipTrigger';

export interface TooltipBaseProps extends RadixTooltipProps {
  providerProps?: TooltipProviderProps;
}

export const TooltipBase = ({
  children,
  providerProps,
  ...props
}: PropsWithChildren<TooltipBaseProps>) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <Provider {...providerProps}>
      <Root
        open={isTooltipVisible}
        onOpenChange={setIsTooltipVisible}
        {...props}
      >
        {children}
      </Root>
    </Provider>
  );
};

TooltipBase.Trigger = TooltipTrigger;
TooltipBase.Content = TooltipContent;
