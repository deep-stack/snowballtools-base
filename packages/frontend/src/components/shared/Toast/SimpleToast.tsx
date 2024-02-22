import React, { useMemo } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { ToastProps } from '@radix-ui/react-toast';
import { motion } from 'framer-motion';
import { simpleToastTheme, type SimpleToastTheme } from './SimpleToast.theme';
import {
  LoadingIcon,
  CheckRoundFilledIcon,
  CrossIcon,
  InfoRoundFilledIcon,
  WarningIcon,
} from 'components/shared/CustomIcon';
import { Button, ButtonBaseProps, ButtonTheme } from 'components/shared/Button';
import { cloneIcon } from 'utils/cloneIcon';

interface CtaProps extends ButtonBaseProps, ButtonTheme {
  buttonLabel: string;
}
export interface SimpleToastProps extends ToastProps {
  title: string;
  variant?: SimpleToastTheme['variant'];
  cta?: CtaProps[];
  onDismiss: (id?: string) => void;
}

export const SimpleToast = ({
  className,
  title,
  variant = 'success',
  cta = [],
  onDismiss,
  ...props
}: SimpleToastProps) => {
  const hasCta = cta.length > 0;
  const {
    wrapper: wrapperCls,
    icon: iconCls,
    closeIcon: closeIconCls,
    title: titleCls,
  } = simpleToastTheme({ variant });

  const Icon = useMemo(() => {
    if (variant === 'success') return <CheckRoundFilledIcon />;
    if (variant === 'error') return <WarningIcon />;
    if (variant === 'warning') return <WarningIcon />;
    if (variant === 'info') return <InfoRoundFilledIcon />;
    return <LoadingIcon />; // variant === 'loading'
  }, [variant]);

  const renderCta = useMemo(
    () =>
      hasCta ? (
        <div className="flex gap-1.5 ml-2">
          {cta.map(({ buttonLabel, ...props }, index) => (
            <Button key={index} {...props}>
              {buttonLabel}
            </Button>
          ))}
        </div>
      ) : null,
    [cta],
  );

  const renderCloseButton = useMemo(
    () => (
      <div onClick={() => onDismiss(props.id)} className={closeIconCls()}>
        <CrossIcon className="h-3 w-3" />
      </div>
    ),
    [],
  );

  return (
    <ToastPrimitive.Root {...props} asChild>
      <motion.li
        animate={{
          y: 'var(--radix-toast-swipe-move-y, 0)',
          opacity: 1,
        }}
        className={wrapperCls({ class: className })}
        exit={{ y: '100%', opacity: 0 }}
        initial={{ y: '100%', opacity: 0 }}
      >
        {cloneIcon(Icon, { className: iconCls() })}
        <ToastPrimitive.Title asChild>
          <p className={titleCls()}>{title}</p>
        </ToastPrimitive.Title>
        {renderCta}
        {renderCloseButton}
      </motion.li>
    </ToastPrimitive.Root>
  );
};
