import React, { useMemo } from 'react';
import { Link, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { Tabs, TabsHeader, TabsBody, Tab } from '@material-tailwind/react';

import { OutletContextType } from '../../../../types';

const tabsData = [
  {
    label: 'General',
    icon: '^',
    value: 'general',
  },
  {
    label: 'Domains',
    icon: '^',
    value: 'domains',
  },
  {
    label: 'Git',
    icon: '^',
    value: 'git',
  },
  {
    label: 'Environment variables',
    icon: '^',
    value: 'environment-variables',
  },
  {
    label: 'Members',
    icon: '^',
    value: 'members',
  },
];

const SettingsTabPanel = () => {
  const { project, onUpdate } = useOutletContext<OutletContextType>();

  const location = useLocation();

  const currentTab = useMemo(() => {
    if (project) {
      const currTabArr = location.pathname.split('settings');
      return currTabArr[currTabArr.length - 1];
    } else {
      return;
    }
  }, [location, project]);

  return (
    <>
      <Tabs
        value={currentTab}
        orientation="vertical"
        className="grid grid-cols-4"
      >
        <TabsHeader
          className="bg-transparent col-span-1"
          indicatorProps={{
            className: 'bg-gray-900/10 shadow-none !text-gray-900',
          }}
        >
          {tabsData.map(({ label, value, icon }) => (
            <Link key={value} to={value === 'general' ? '' : value}>
              <Tab
                value={value === 'general' ? '' : `/${value}`}
                className="flex justify-start"
              >
                <div className="flex gap-2">
                  <div>{icon}</div>
                  <div>{label}</div>
                </div>
              </Tab>
            </Link>
          ))}
        </TabsHeader>
        <TabsBody className="col-span-2">
          <Outlet context={{ project, onUpdate }} />
        </TabsBody>
      </Tabs>
    </>
  );
};

export default SettingsTabPanel;
