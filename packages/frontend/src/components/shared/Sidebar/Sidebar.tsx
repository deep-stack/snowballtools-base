import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'gql-client';
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
import { BASE_URL } from 'utils/constants';

interface SidebarProps {
  mobileOpen?: boolean;
}

export const Sidebar = ({ mobileOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const client = useGQLClient();
  const isDesktop = useMediaQuery('(min-width: 960px)');

  const [user, setUser] = useState<User>();
  const { disconnect } = useDisconnect();

  const fetchUser = useCallback(async () => {
    const { user } = await client.getUser();
    setUser(user);
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogOut = useCallback(async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.clear();
    disconnect();
    navigate('/login');
  }, [disconnect, navigate]);

  return (
    <motion.nav
      initial={{ x: -320 }}
      animate={{ x: isDesktop || mobileOpen ? 0 : -320 }}
      exit={{ x: -320 }}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      className={cn(
        'h-full flex-none w-[320px] flex flex-col overflow-y-auto',
        {
          flex: mobileOpen,
        },
      )}
    >
      <div
        className={cn(
          'flex flex-col h-full pt-5 lg:pt-8 pb-0 px-4 lg:px-6 lg:pb-8 gap-9',
        )}
      >
        {/* Logo */}
        <div className="hidden lg:flex">
          <Logo />
        </div>
        {/* This element ensures the space between logo and navigation */}
        <div className="flex-1"></div>
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
