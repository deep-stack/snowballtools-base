import React, { ComponentPropsWithoutRef } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';

import { Heading } from 'components/shared/Heading';
import { WavyBorder } from 'components/shared/WavyBorder';
import { Button } from 'components/shared/Button';
import { CrossIcon } from 'components/shared/CustomIcon';
import { cn } from 'utils/classnames';

export interface CreateProjectLayoutProps
  extends ComponentPropsWithoutRef<'section'> {}

export const CreateProjectLayout = ({
  className,
  ...props
}: CreateProjectLayoutProps) => {
  const { orgSlug } = useParams();

  return (
    <section {...props} className={cn('h-full flex flex-col', className)}>
      <div className="sticky top-0">
        <div className="flex px-6 py-4 bg-base-bg items-center gap-4">
          <Heading as="h2" className="flex-1 text-[24px] font-medium">
            Create new project
          </Heading>
          <Link to={`/${orgSlug}`}>
            <Button iconOnly variant="tertiary">
              <CrossIcon size={18} />
            </Button>
          </Link>
        </div>
        <WavyBorder />
      </div>
      <section className="px-6 h-full flex-1 py-6 overflow-y-auto">
        <Outlet />
      </section>
    </section>
  );
};
