import {
  Arrow,
  Content,
  Portal,
  type TooltipArrowProps,
  type TooltipContentProps,
} from '@radix-ui/react-tooltip';

import { tooltipTheme } from '../Tooltip.theme';

export interface ContentProps extends TooltipContentProps {
  hasArrow?: boolean;
  arrowProps?: TooltipArrowProps;
}

export const TooltipContent = ({
  children,
  arrowProps,
  className,
  hasArrow = true,
  ...props
}: ContentProps) => {
  const { content, arrow } = tooltipTheme();
  return (
    <Portal>
      <Content
        className={content({
          className,
        })}
        sideOffset={5}
        {...props}
      >
        {hasArrow && (
          <Arrow
            className={arrow({
              className: arrowProps?.className,
            })}
            {...arrowProps}
          />
        )}
        {children}
      </Content>
    </Portal>
  );
};
