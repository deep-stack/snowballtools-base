import { ComponentPropsWithoutRef } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';

import { Heading } from 'components/shared/Heading';
import { WavyBorder } from 'components/shared/WavyBorder';
import { Button } from 'components/shared/Button';
import { CrossIcon } from 'components/shared/CustomIcon';
import { cn } from 'utils/classnames';
import * as Dialog from '@radix-ui/react-dialog';

export interface CreateProjectLayoutProps
  extends ComponentPropsWithoutRef<'section'> {}

export const CreateProjectLayout = ({
  className,
  ...props
}: CreateProjectLayoutProps) => {

  const closeBtnLink = `/`;

  const heading = (
    <Heading as="h2" className="flex-1 text-xl md:text-2xl font-medium">
      Create new project
    </Heading>
  );

  return (
    <>
      {/* Desktop */}
      <section
        {...props}
        className={cn('h-full flex-col hidden md:flex', className)}
      >
        <div className="sticky top-0">
          <div className="flex px-6 py-4 bg-base-bg items-center gap-4">
            {heading}

            {/* Cannot save btn as variable since responsive variant don't work with compoundVariant */}
            <Link to={closeBtnLink}>
              <Button
                iconOnly
                variant="tertiary"
                leftIcon={<CrossIcon />}
                aria-label="close"
              />
            </Link>
          </div>
          <WavyBorder />
        </div>

        <section className="px-6 h-full flex-1 py-6 overflow-y-auto">
          <Outlet />
        </section>
      </section>

      {/* Mobile */}
      {/* Setting modal={false} so even if modal is active on desktop, it doesn't block clicks */}
      <Dialog.Root modal={false} open={true}>
        <Dialog.Portal>
          {/* Not using <Dialog.Overlay> since modal={false} disables it and its content will not show */}
          <div className="bg-base-canvas fixed inset-0 md:hidden overflow-y-auto p-1">
            <Dialog.Content className="min-h-full overflow-hidden rounded-2xl bg-base-bg shadow-card focus:outline-none">
              {/* Heading */}
              <div className="flex px-6 py-4 h-20 items-center gap-4">
                {heading}
                <Dialog.Close asChild>
                  <Link to={closeBtnLink}>
                    <Button
                      iconOnly
                      variant="tertiary"
                      leftIcon={<CrossIcon />}
                      aria-label="close"
                      size="sm"
                    />
                  </Link>
                </Dialog.Close>
              </div>

              {/* Border */}
              <WavyBorder />

              {/* Page content */}
              <div className="px-4 py-6">
                <Outlet />
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
