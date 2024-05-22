import { useMemo } from 'react';
import { Link, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { OutletContextType } from '../../../../types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'components/shared/Tabs';
import {
  BranchStrokeIcon,
  CollaboratorsIcon,
  GearIcon,
  GlobeIcon,
  SwitchIcon,
} from 'components/shared/CustomIcon';

const tabsData = [
  {
    label: 'General',
    icon: <GearIcon />,
    value: 'general',
  },
  {
    label: 'Domains',
    icon: <GlobeIcon />,
    value: 'domains',
  },
  {
    label: 'Git',
    icon: <BranchStrokeIcon />,
    value: 'git',
  },
  {
    label: 'Environment variables',
    icon: <SwitchIcon />,
    value: 'environment-variables',
  },
  {
    label: 'Collaborators',
    icon: <CollaboratorsIcon />,
    value: 'collaborators',
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
        className="grid grid-cols-5"
      >
        <TabsList className="col-span-1">
          {tabsData.map(({ label, value, icon }) => (
            <Link key={value} to={value === 'general' ? '' : value}>
              <TabsTrigger
                value={value === 'general' ? '' : `/${value}`}
                className="col-span-1"
              >
                <div className="items-center gap-2 inline-flex">
                  <div className="items-center">{icon}</div>
                  <div className="items-center">{label}</div>
                </div>
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
        <TabsContent value={currentTab ?? ''} className="col-span-3">
          <Outlet context={{ project, onUpdate }} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SettingsTabPanel;
