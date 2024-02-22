import React, { useMemo } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { ToastProps } from '@radix-ui/react-toast';
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
import { cn } from 'utils/classnames';

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
    [],
  );

  const renderCloseButton = () => (
    <div onClick={() => onDismiss(props.id)} className={closeIconCls()}>
      <CrossIcon className="h-3 w-3" />
    </div>
  );

  return (
    <ToastPrimitive.Root {...props} asChild>
      <div className={wrapperCls({ class: cn(className) })}>
        {cloneIcon(Icon, { className: iconCls() })}
        <ToastPrimitive.Title asChild>
          <p className={titleCls()}>{title}</p>
        </ToastPrimitive.Title>
        {renderCta}
        {renderCloseButton()}
      </div>
    </ToastPrimitive.Root>
  );
};
