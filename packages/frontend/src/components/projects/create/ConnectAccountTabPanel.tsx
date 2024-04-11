import React from 'react';

import { Tabs } from 'components/shared/Tabs';

const ConnectAccountTabPanel: React.FC = () => {
  return (
    <Tabs
      defaultValue="Connect Accounts Tab Panel"
      orientation="horizontal"
      className="mt-10"
    >
      <Tabs.List>
        {[
          { title: 'Import a repository' },
          { title: 'Start with a template' },
        ].map(({ title }, index) => (
          <Tabs.Trigger value={title} key={index}>
            {title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
};

export default ConnectAccountTabPanel;
