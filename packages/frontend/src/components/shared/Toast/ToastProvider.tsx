import React from 'react';
import {
  Provider,
  Viewport,
  type ToastProviderProps,
} from '@radix-ui/react-toast';

export const ToastProvider = ({ children, ...props }: ToastProviderProps) => {
  return (
    <Provider swipeDirection="down" {...props}>
      {children}
      <Viewport className="fixed inset-x-0 bottom-0 px-4 py-10" />
    </Provider>
  );
};
