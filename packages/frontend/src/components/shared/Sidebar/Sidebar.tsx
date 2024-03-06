import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Organization, User } from 'gql-client';
import { motion } from 'framer-motion';

import { useDisconnect } from 'wagmi';

import { useGQLClient } from 'context/GQLClientContext';
import {
  GlobeIcon,
  LifeBuoyIcon,
  LogoutIcon,
  QuestionMarkRoundIcon,
} from 'components/shared/CustomIcon';
import { Tabs } from 'components/shared/Tabs';
import { Logo } from 'components/Logo';
import { Avatar } from 'components/shared/Avatar';
import { formatAddress } from 'utils/format';
import { getInitials } from 'utils/geInitials';
import { Button } from 'components/shared/Button';
import { cn } from 'utils/classnames';
import { useMediaQuery } from 'usehooks-ts';
import { SIDEBAR_MENU } from './constants';
import { UserSelect } from 'components/shared/UserSelect';

interface SidebarProps {
  mobileOpen?: boolean;
}

export const Sidebar = ({ mobileOpen }: SidebarProps) => {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const client = useGQLClient();
  const { disconnect } = useDisconnect();
  const isDesktop = useMediaQuery('(min-width: 960px)');

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

  const formattedSelected = useMemo(() => {
    const selected = organizations.find((org) => org.slug === selectedOrgSlug);
    return {
      value: selected?.slug ?? '',
      label: selected?.name ?? '',
      imgSrc: '/logo.svg',
    };
  }, [organizations, selectedOrgSlug, orgSlug]);

  const formattedSelectOptions = useMemo(() => {
    return organizations.map((org) => ({
      value: org.slug,
      label: org.name,
      imgSrc: '/logo.svg',
    }));
  }, [organizations, selectedOrgSlug, orgSlug]);

  const renderMenu = useMemo(() => {
    return SIDEBAR_MENU(orgSlug).map(({ title, icon, url }, index) => (
      <NavLink to={url} key={index}>
        <Tabs.Trigger icon={icon} value={title}>
          {title}
        </Tabs.Trigger>
      </NavLink>
    ));
  }, [orgSlug]);

  const handleLogOut = useCallback(() => {
    disconnect();
    navigate('/login');
  }, [disconnect, navigate]);

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
          <UserSelect
            value={formattedSelected}
            options={formattedSelectOptions}
          />
          <Tabs defaultValue="Projects" orientation="vertical">
            <Tabs.List>{renderMenu}</Tabs.List>
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
              fallbackProps={{ className: 'bg-base-bg-alternate' }}
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
