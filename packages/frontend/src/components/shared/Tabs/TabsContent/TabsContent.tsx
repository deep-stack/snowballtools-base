import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { Content } from '@radix-ui/react-tabs';

import { tabsTheme } from '../Tabs.theme';

export interface TabsContentProps
  extends ComponentPropsWithoutRef<typeof Content> {}

/**
 * A component that represents the content of the tabs component.
 */
const TabsContent = forwardRef<ElementRef<typeof Content>, TabsContentProps>(
  ({ className, ...props }, ref) => {
    const { content } = tabsTheme();
    return <Content ref={ref} className={content({ className })} {...props} />;
  },
);

// Assigns the display name to the TabsContent component.
TabsContent.displayName = 'TabsContent';

export { TabsContent };
