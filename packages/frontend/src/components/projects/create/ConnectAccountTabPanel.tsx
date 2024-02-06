import React from 'react';

import { Tabs, TabsHeader, Tab } from '@material-tailwind/react';

const ConnectAccountTabPanel = () => {
  return (
    <Tabs className="grid bg-white h-32 p-2 m-4 rounded-md" value="import">
      <TabsHeader className="grid grid-cols-2">
        <Tab className="row-span-1" value="import">
          Import a repository
        </Tab>
        <Tab className="row-span-2" value="template">
          Start with a template
        </Tab>
      </TabsHeader>
      {/* <TabsBody> */}
      {/* TODO: Add content */}
      {/* </TabsBody> */}
    </Tabs>
  );
};

export default ConnectAccountTabPanel;
