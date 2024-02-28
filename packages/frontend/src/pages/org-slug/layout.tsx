import { Sidebar } from 'components/shared/Sidebar';
import { GitClientProvider } from 'context/GitClientContext';
import { OctokitProvider } from 'context/OctokitContext';
import React, { ComponentPropsWithoutRef } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from 'utils/classnames';

export interface DashboardLayoutProps
  extends ComponentPropsWithoutRef<'section'> {}

export const DashboardLayout = ({
  className,
  children,
  ...props
}: DashboardLayoutProps) => {
  return (
    <section
      {...props}
      className={cn('grid grid-cols-5 h-screen bg-snowball-50', className)}
    >
      <Sidebar />
      <div className="col-span-4 h-full px-3 py-3 overflow-y-hidden">
        <div className="rounded-3xl bg-base-bg h-full shadow-card overflow-y-auto relative">
          <OctokitProvider>
            <GitClientProvider>
              <Outlet />
            </GitClientProvider>
          </OctokitProvider>
        </div>
      </div>
      {children}
    </section>
  );
};
