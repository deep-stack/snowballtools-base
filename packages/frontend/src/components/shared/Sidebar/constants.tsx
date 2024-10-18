import { FolderIcon, SettingsSlidersIcon } from 'components/shared/CustomIcon';

export const SIDEBAR_MENU = () => [
  {
    title: 'Projects',
    url: `/`,
    icon: <FolderIcon />,
  },
  {
    title: 'Settings',
    url: `/settings`,
    icon: <SettingsSlidersIcon />,
  },
];
