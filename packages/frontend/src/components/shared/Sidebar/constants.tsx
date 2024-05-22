import { FolderIcon, SettingsSlidersIcon } from 'components/shared/CustomIcon';

export const SIDEBAR_MENU = (orgSlug?: string) => [
  {
    title: 'Projects',
    url: `/${orgSlug}/`,
    icon: <FolderIcon />,
  },
  {
    title: 'Settings',
    url: `/${orgSlug}/settings`,
    icon: <SettingsSlidersIcon />,
  },
];
