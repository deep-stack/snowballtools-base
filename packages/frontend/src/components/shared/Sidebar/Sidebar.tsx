import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Organization, User } from 'gql-client';
import { motion } from 'framer-motion';

import { Option } from '@material-tailwind/react';
import { useDisconnect } from 'wagmi';

import { useGQLClient } from 'context/GQLClientContext';
import AsyncSelect from 'components/shared/AsyncSelect';
import {
  ChevronGrabberHorizontal,
  FolderIcon,
  GlobeIcon,
  LifeBuoyIcon,
  LogoutIcon,
  QuestionMarkRoundIcon,
  SettingsSlidersIcon,
} from 'components/shared/CustomIcon';
import { Tabs } from 'components/shared/Tabs';
import { Logo } from 'components/Logo';
import { Avatar } from 'components/shared/Avatar';
import { formatAddress } from 'utils/format';
import { getInitials } from 'utils/geInitials';
import { Button } from 'components/shared/Button';
import { cn } from 'utils/classnames';
import { useMediaQuery } from 'usehooks-ts';

interface SidebarProps {
  mobileOpen?: boolean;
}

export const Sidebar = ({ mobileOpen }: SidebarProps) => {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const client = useGQLClient();
  const { disconnect } = useDisconnect();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [user, setUser] = useState<User>();

  const fetchUser = useCallback(async () => {
    const { user } = await client.getUser();
    setUser(user);
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const [selectedOrgSlug, setSelectedOrgSlug] = useState(orgSlug);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const fetchUserOrganizations = useCallback(async () => {
    const { organizations } = await client.getOrganizations();
    setOrganizations(organizations);
  }, [orgSlug]);

  useEffect(() => {
    fetchUserOrganizations();
    setSelectedOrgSlug(orgSlug);
  }, [orgSlug]);

  const handleLogOut = useCallback(() => {
    disconnect();
    navigate('/login');
  }, [disconnect, navigate]);
  console.log(isDesktop);
  return (
    <motion.nav
      initial={{ x: -320 }}
      animate={{ x: isDesktop || mobileOpen ? 0 : -320 }}
      exit={{ x: -320 }}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      className={cn('h-full flex-none w-[320px] flex flex-col', {
        flex: mobileOpen,
      })}
    >
      <div
        className={cn(
          'flex flex-col h-full pt-5 lg:pt-8 pb-0 px-4 lg:px-6 lg:pb-8 gap-9',
        )}
      >
        {/* Logo */}
        <div className="hidden lg:flex">
          <Logo orgSlug={orgSlug} />
        </div>
        {/* Switch organization */}
        <div className="flex flex-1 flex-col gap-4">
          <AsyncSelect
            containerProps={{ className: 'h-14 border-none' }}
            labelProps={{ className: 'before:border-none after:border-none' }}
            className="bg-white rounded-lg shadow border-none"
            value={selectedOrgSlug}
            onChange={(value) => {
              setSelectedOrgSlug(value!);
              navigate(`/${value}`);
            }}
            selected={(_, index) => (
              <div className="flex items-center space-x-3">
                <img
                  src="/logo.svg"
                  alt="Application Logo"
                  className="h-8 w-8 rounded-lg"
                />
                <div>
                  <div className="text-sm font-semibold">
                    {organizations[index!]?.name}
                  </div>
                  <div className="text-xs text-gray-500">Organization</div>
                </div>
              </div>
            )}
            arrow={
              <ChevronGrabberHorizontal className="h-4 w-4 text-gray-500" />
            }
          >
            {/* // TODO: Show label organization and manage in option */}
            {organizations.map((org) => (
              <Option key={org.id} value={org.slug}>
                <div className="flex items-center space-x-3">
                  <img
                    src="/logo.svg"
                    alt="Application Logo"
                    className="h-8 w-8 rounded-lg"
                  />
                  <div>
                    <div className="text-sm font-semibold">{org.name}</div>
                    <div className="text-xs text-gray-500">Organization</div>
                  </div>
                </div>
              </Option>
            ))}
          </AsyncSelect>
          <Tabs defaultValue="Projects" orientation="vertical">
            <Tabs.List>
              {[
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
              ].map(({ title, icon, url }, index) => (
                <NavLink to={url} key={index}>
                  <Tabs.Trigger icon={icon} value={title}>
                    {title}
                  </Tabs.Trigger>
                </NavLink>
              ))}
            </Tabs.List>
          </Tabs>
        </div>
        {/* Bottom navigation */}
        <div className="flex flex-col gap-5 justify-end">
          <Tabs defaultValue="Projects" orientation="vertical">
            {/* // TODO: use proper link buttons */}
            <Tabs.List>
              <Tabs.Trigger
                icon={<GlobeIcon />}
                value=""
                className="hidden lg:flex"
              >
                <a className="cursor-pointer" onClick={handleLogOut}>
                  Log Out
                </a>
              </Tabs.Trigger>
              <Tabs.Trigger icon={<QuestionMarkRoundIcon />} value="">
                <a className="cursor-pointer">Documentation</a>
              </Tabs.Trigger>
              <Tabs.Trigger icon={<LifeBuoyIcon />} value="">
                <a className="cursor-pointer">Support</a>
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
      </div>
      {/* Only shows when on mobile */}
      <div className="shadow-card-sm py-4 pl-4 pr-2 flex lg:hidden items-center border-t border-border-separator/[0.06]">
        {user?.name && (
          <div className="flex items-center flex-1 gap-3">
            <Avatar
              size={44}
              initials={getInitials(formatAddress(user.name))}
            />
            <p className="text-sm tracking-[-0.006em] text-elements-high-em">
              {formatAddress(user.name)}
            </p>
          </div>
        )}
        <Button
          iconOnly
          variant="ghost"
          className="text-elements-low-em"
          onClick={handleLogOut}
        >
          <LogoutIcon />
        </Button>
      </div>
    </motion.nav>
  );
};
