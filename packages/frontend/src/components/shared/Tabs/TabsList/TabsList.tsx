import React, {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { List } from '@radix-ui/react-tabs';

import { tabsTheme } from 'components/shared/Tabs/Tabs.theme';

export interface TabsListProps extends ComponentPropsWithoutRef<typeof List> {}

/**
 * A component that represents the list of tabs.
 */
const TabsList = forwardRef<ElementRef<typeof List>, TabsListProps>(
  ({ className, ...props }, ref) => {
    const { triggerList } = tabsTheme({ className });
    return <List ref={ref} className={triggerList({ className })} {...props} />;
  },
);

// Assigns the display name to the TabsList component.
TabsList.displayName = 'TabsList';

export { TabsList };
