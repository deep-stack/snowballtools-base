import React from 'react';
import { Tabs } from 'components/shared/Tabs';
import { Badge } from 'components/shared/Badge';
import { GlobeIcon } from 'components/shared/CustomIcon';

const tabs = Array.from({ length: 8 });

export const renderTabs = () => {
  return (
    <Tabs defaultValue="A">
      <Tabs.List>
        {tabs.map((_, index) => (
          <Tabs.Trigger key={index} value={index.toString()}>
            Tab item {index}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
};

export const renderTabWithBadges = () => {
  return (
    <Tabs defaultValue="A">
      <Tabs.List>
        {tabs.map((_, index) => (
          <Tabs.Trigger
            key={index}
            value={index.toString()}
            icon={<Badge variant="tertiary">{index}</Badge>}
          >
            Tab item
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
};

export const renderVerticalTabs = () => {
  return (
    <Tabs defaultValue="A" orientation="vertical">
      <Tabs.List>
        {tabs.slice(0, 4).map((_, index) => (
          <Tabs.Trigger
            key={index}
            icon={<GlobeIcon />}
            value={index.toString()}
          >
            Tab item {index}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
};
