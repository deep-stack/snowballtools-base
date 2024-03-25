import React from 'react';
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { modalTheme } from 'components/shared/Modal/Modal.theme';

type ModalFooterProps = ComponentPropsWithoutRef<'div'> & {
  className?: string;
};

export const ModalFooter = ({
  children,
  className,
  ...props
}: PropsWithChildren<ModalFooterProps>) => {
  const { footer } = modalTheme({
    className,
  });

  return (
    <footer className={footer({ className })} {...props}>
      {children}
    </footer>
  );
};
