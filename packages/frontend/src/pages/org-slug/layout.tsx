import { Logo } from 'components/Logo';
import { Button } from 'components/shared/Button';
import {
  MenuIcon,
  NotificationBellIcon,
  SearchIcon,
} from 'components/shared/CustomIcon';
import { Sidebar } from 'components/shared/Sidebar';
import { OctokitProvider } from 'context/OctokitContext';
import React, { ComponentPropsWithoutRef } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { cn } from 'utils/classnames';

export interface DashboardLayoutProps
  extends ComponentPropsWithoutRef<'section'> {}

export const DashboardLayout = ({
  className,
  children,
  ...props
}: DashboardLayoutProps) => {
  const { orgSlug } = useParams();

  return (
    <section
      {...props}
      className={cn(
        'flex flex-col lg:flex-row h-screen bg-snowball-50',
        className,
      )}
    >
      <Sidebar />
      {/* Header on mobile */}
      <div className="flex lg:hidden items-center px-4 py-4 justify-between">
        <Logo orgSlug={orgSlug} />
        <div className="flex items-center gap-0.5">
          <Button iconOnly variant="ghost">
            <NotificationBellIcon size={18} />
          </Button>
          <Button iconOnly variant="ghost">
            <SearchIcon size={18} />
          </Button>
          <Button iconOnly variant="ghost">
            <MenuIcon size={18} />
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full h-full px-1 py-1 md:px-3 md:py-3 overflow-y-hidden">
        <div className="rounded-3xl bg-base-bg h-full shadow-card overflow-y-auto relative">
          <OctokitProvider>
            <Outlet />
          </OctokitProvider>
        </div>
      </div>
      {children}
    </section>
  );
};
