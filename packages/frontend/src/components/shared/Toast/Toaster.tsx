import React, { ComponentPropsWithoutRef, useMemo } from 'react';
import { Provider, Viewport } from '@radix-ui/react-toast';
import { SimpleToast, SimpleToastProps } from './SimpleToast';
import { useToast } from './useToast';

interface ToasterProps extends ComponentPropsWithoutRef<'div'> {}

export const Toaster = ({}: ToasterProps) => {
  const { toasts } = useToast();

  const renderToasts = useMemo(
    () =>
      toasts.map(({ id, ...props }) => (
        <SimpleToast key={id} {...(props as SimpleToastProps)} />
      )),
    [toasts],
  );

  return (
    <Provider>
      {renderToasts}
      <Viewport className="z-toast fixed inset-x-0 bottom-0 mx-auto w-fit px-4 pb-10" />
    </Provider>
  );
};
