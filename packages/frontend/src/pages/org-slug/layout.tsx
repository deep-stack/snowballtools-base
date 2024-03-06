import { Logo } from 'components/Logo';
import { Button } from 'components/shared/Button';
import {
  CrossIcon,
  MenuIcon,
  NotificationBellIcon,
  SearchIcon,
} from 'components/shared/CustomIcon';
import { Sidebar } from 'components/shared/Sidebar';
import { OctokitProvider } from 'context/OctokitContext';
import React, { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from 'utils/classnames';
import { useMediaQuery } from 'usehooks-ts';
import { ProjectSearchBarDialog } from 'components/projects/ProjectSearchBar';

export interface DashboardLayoutProps
  extends ComponentPropsWithoutRef<'section'> {}

export const DashboardLayout = ({
  className,
  ...props
}: DashboardLayoutProps) => {
  const { orgSlug } = useParams();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [isDesktop]);

  return (
    <>
      <section
        {...props}
        className={cn(
          'flex flex-col lg:flex-row h-screen bg-snowball-50',
          className,
        )}
      >
        {/* Header on mobile */}
        <div className="flex lg:hidden items-center px-4 py-4 justify-between">
          <Logo orgSlug={orgSlug} />
          <div className="flex items-center gap-0.5">
            <AnimatePresence>
              {isSidebarOpen ? (
                <motion.div
                  key="crossIcon"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.2, delay: 0.3 },
                  }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                >
                  <Button
                    iconOnly
                    variant="ghost"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <CrossIcon size={18} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="menuIcons"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.2, delay: 0.2 },
                  }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                >
                  <>
                    <Button iconOnly variant="ghost">
                      <NotificationBellIcon size={18} />
                    </Button>
                    <Button
                      iconOnly
                      variant="ghost"
                      onClick={() => setIsSearchOpen(true)}
                    >
                      <SearchIcon size={18} />
                    </Button>
                    <Button
                      iconOnly
                      variant="ghost"
                      onClick={() => setIsSidebarOpen(true)}
                    >
                      <MenuIcon size={18} />
                    </Button>
                  </>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex h-full w-full overflow-hidden">
          <Sidebar mobileOpen={isSidebarOpen} />
          <motion.div
            className={cn(
              'w-full h-full pr-1 pl-1 py-1 md:pl-0 md:pr-3 md:py-3 overflow-y-hidden min-w-[320px]',
              { 'flex-shrink-0': isSidebarOpen || !isDesktop },
            )}
            animate={{
              x: isSidebarOpen || isDesktop ? 0 : -320,
            }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          >
            <div className="rounded-3xl bg-base-bg h-full shadow-card overflow-y-auto relative">
              <OctokitProvider>
                <Outlet />
              </OctokitProvider>
            </div>
          </motion.div>
        </div>
      </section>
      <ProjectSearchBarDialog
        open={isSearchOpen}
        onClickItem={() => setIsSearchOpen(false)}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
