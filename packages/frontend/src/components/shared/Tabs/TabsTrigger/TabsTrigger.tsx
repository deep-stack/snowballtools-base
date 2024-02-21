import React, {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { Trigger } from '@radix-ui/react-tabs';

import { tabsTheme } from 'components/shared/Tabs/Tabs.theme';
import { useTabs } from 'components/shared/Tabs/TabsProvider';

export interface TabsTriggerProps
  extends ComponentPropsWithoutRef<typeof Trigger> {
  /**
   * The icon to display in the trigger.
   */
  icon?: ReactNode;
}

/**
 * A component that represents the trigger for the tabs component.
 */
const TabsTrigger = forwardRef<
  ElementRef<typeof Trigger>,
  PropsWithChildren<TabsTriggerProps>
>(({ className, icon, children, ...props }, ref) => {
  const config = useTabs();
  const { triggerWrapper, trigger } = tabsTheme(config);
  const orientation = config.orientation;

  return (
    <Trigger
      ref={ref}
      // Disabled focus state for horizontal tabs
      tabIndex={orientation === 'horizontal' ? -1 : undefined}
      className={triggerWrapper({ className })}
      {...props}
    >
      {/* Need to add button in the trigger children because there's focus state inside the children */}
      <button
        data-orientation={orientation}
        // Disabled focus state for vertical tabs
        tabIndex={orientation === 'vertical' ? -1 : undefined}
        className={trigger()}
      >
        {/* Put the icon on the left of the text for veritcal tab */}
        {orientation === 'vertical' && icon}
        {children}
        {/* Put the icon on the right of the text for horizontal tab */}
        {orientation === 'horizontal' && icon}
      </button>
    </Trigger>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

export { TabsTrigger };
