import {
  forwardRef,
  ReactNode,
  useMemo,
  ComponentPropsWithoutRef,
} from 'react';

import { WarningIcon } from 'components/shared/CustomIcon';
import { cloneIcon } from 'utils/cloneIcon';
import { cn } from 'utils/classnames';

import { InputTheme, inputTheme } from './Input.theme';

export interface InputProps
  extends InputTheme,
    Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  label?: string;
  description?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      description,
      leftIcon,
      rightIcon,
      helperText,
      size,
      state,
      appearance,
      ...props
    },
    ref,
  ) => {
    const styleProps = useMemo(
      () => ({
        size: size || 'md',
        state: state || 'default',
        appearance, // Pass appearance to inputTheme
      }),
      [size, state, appearance],
    );

    const {
      container: containerCls,
      label: labelCls,
      description: descriptionCls,
      input: inputCls,
      icon: iconCls,
      iconContainer: iconContainerCls,
      helperText: helperTextCls,
      helperIcon: helperIconCls,
    } = inputTheme({ ...styleProps });

    const renderLabels = useMemo(() => {
      if (!label && !description) return null;
      return (
        <div className="flex flex-col gap-y-1">
          <p className={labelCls()}>{label}</p>
          <p className={descriptionCls()}>{description}</p>
        </div>
      );
    }, [labelCls, descriptionCls, label, description]);

    const renderLeftIcon = useMemo(() => {
      return (
        <div className={iconContainerCls({ class: 'left-0 pl-4' })}>
          {cloneIcon(leftIcon, { className: iconCls(), 'aria-hidden': true })}
        </div>
      );
    }, [cloneIcon, iconCls, iconContainerCls, leftIcon]);

    const renderRightIcon = useMemo(() => {
      return (
        <div className={iconContainerCls({ class: 'pr-4 right-0' })}>
          {cloneIcon(rightIcon, { className: iconCls(), 'aria-hidden': true })}
        </div>
      );
    }, [cloneIcon, iconCls, iconContainerCls, rightIcon]);

    const renderHelperText = useMemo(() => {
      if (!helperText) return null;
      return (
        <div className={helperTextCls()}>
          {state &&
            cloneIcon(<WarningIcon className={helperIconCls()} />, {
              'aria-hidden': true,
            })}
          <p>{helperText}</p>
        </div>
      );
    }, [cloneIcon, state, helperIconCls, helperText, helperTextCls]);

    return (
      <div className="flex flex-col gap-y-2 w-full">
        {renderLabels}
        <div className={containerCls({ class: className })}>
          {leftIcon && renderLeftIcon}
          <input
            className={cn(inputCls(), {
              'pl-10': leftIcon,
            })}
            ref={ref}
            {...props}
          />
          {rightIcon && renderRightIcon}
        </div>
        {renderHelperText}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
