import React, { useMemo } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { ToastProps } from '@radix-ui/react-toast';
import { simpleToastTheme, type SimpleToastTheme } from './SimpleToast.theme';
import { CheckIcon, CheckRoundFilledIcon } from 'components/shared/CustomIcon';
import { cloneIcon } from 'utils/cloneIcon';

export interface SimpleToastProps extends ToastProps {
  title: string;
  variant?: SimpleToastTheme['variant'];
}

export const SimpleToast = ({
  className,
  title,
  variant = 'success',
  ...props
}: SimpleToastProps) => {
  const {
    wrapper: wrapperCls,
    icon: iconCls,
    title: titleCls,
  } = simpleToastTheme({ variant });

  const Icon = useMemo(() => {
    if (variant === 'success') return <CheckRoundFilledIcon />;
    if (variant === 'error') return <CheckIcon />;
    if (variant === 'warning') return <CheckIcon />;
    if (variant === 'info') return <CheckIcon />;
    return <CheckIcon />; // variant === 'loading'
  }, [variant]);

  return (
    <ToastPrimitive.Root {...props} asChild>
      <div className={wrapperCls({ class: className })}>
        {cloneIcon(Icon, { className: iconCls() })}
        <ToastPrimitive.Title asChild>
          <p className={titleCls()}>{title}</p>
        </ToastPrimitive.Title>
      </div>
    </ToastPrimitive.Root>
  );
};
