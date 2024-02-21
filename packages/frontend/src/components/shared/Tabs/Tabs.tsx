import React, { type ComponentPropsWithoutRef } from 'react';
import { Root as TabsRoot } from '@radix-ui/react-tabs';

import { tabsTheme } from './Tabs.theme';
import TabsContent from './TabsContent';
import TabsList from './TabsList';
import TabsTrigger from './TabsTrigger';
import TabsProvider, { TabsProviderProps } from './TabsProvider';

export interface TabsProps extends ComponentPropsWithoutRef<typeof TabsRoot> {
  /**
   * The configuration for the tabs component.
   */
  config?: TabsProviderProps;
}

/**
 * A component that allows users to switch between different tabs.
 * @returns JSX element representing the tabs component.
 */
export const Tabs = ({
  config,
  className,
  orientation = 'horizontal',
  ...props
}: TabsProps) => {
  const { root } = tabsTheme(config);

  return (
    <TabsProvider {...config} orientation={orientation}>
      <TabsRoot
        {...props}
        orientation={orientation}
        className={root({ className })}
      />
    </TabsProvider>
  );
};

/**
 * Assigns the TabsTrigger class to the Trigger property of the Tabs object.
 */
Tabs.Trigger = TabsTrigger;
/**
 * Assigns the TabsList object to the List property of the Tabs object.
 */
Tabs.List = TabsList;
/**
 * Assigns the TabsContent component to the Content property of the Tabs component.
 */
Tabs.Content = TabsContent;
