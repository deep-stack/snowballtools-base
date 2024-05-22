import {
  createContext,
  useContext,
  type PropsWithChildren,
  ComponentPropsWithoutRef,
} from 'react';
import { TabsVariants } from './Tabs.theme';
import { Root as TabsRoot } from '@radix-ui/react-tabs';

export interface TabsProviderProps
  extends Partial<TabsVariants>,
    ComponentPropsWithoutRef<typeof TabsRoot> {}

type TabsProviderContext = ReturnType<typeof useTabsValues>;

const TabsContext = createContext<Partial<TabsProviderContext>>({});

// For inferring return type
const useTabsValues = (props: TabsProviderProps) => {
  return props;
};

/**
 * A provider component that allows users to switch between different tabs.
 * @returns JSX element representing the tabs provider component.
 */
export const TabsProvider = ({
  children,
  ...props
}: PropsWithChildren<TabsProviderProps>): JSX.Element => {
  const values = useTabsValues(props);
  return <TabsContext.Provider value={values}>{children}</TabsContext.Provider>;
};

/**
 * A hook that returns the context of the tabs provider.
 * @returns The context of the tabs provider.
 */
export const useTabs = () => {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('useTabs was used outside of its Provider');
  }
  return context;
};

export default TabsProvider;
