import React from 'react';
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { modalTheme } from 'components/shared/Modal/Modal.theme';

export interface ModalBodyProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export const ModalBody = ({
  children,
  className,
  ...props
}: PropsWithChildren<ModalBodyProps>) => {
  const { body } = modalTheme();

  return (
    <div
      className={body({
        className,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
