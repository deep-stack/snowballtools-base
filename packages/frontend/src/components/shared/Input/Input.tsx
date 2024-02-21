import React, { ReactNode, useMemo } from 'react';
import { ComponentPropsWithoutRef } from 'react';
import { InputTheme, inputTheme } from './Input.theme';
import { WarningIcon } from 'components/shared/CustomIcon';
import { cloneIcon } from 'utils/cloneIcon';
import { cn } from 'utils/classnames';

export interface InputProps
  extends InputTheme,
    Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  label?: string;
  description?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
}

export const Input = ({
  className,
  label,
  description,
  leftIcon,
  rightIcon,
  helperText,
  size,
  state,
  ...props
}: InputProps) => {
  const styleProps = (({ size = 'md', state }) => ({
    size,
    state,
  }))({ size, state });

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

  const renderLabels = useMemo(
    () => (
      <div className="space-y-1">
        <p className={labelCls()}>{label}</p>
        <p className={descriptionCls()}>{description}</p>
      </div>
    ),
    [labelCls, descriptionCls, label, description],
  );

  const renderLeftIcon = useMemo(() => {
    return (
      <div className={iconContainerCls({ class: 'left-0 pl-4' })}>
        {cloneIcon(leftIcon, { className: iconCls(), ariaHidden: true })}
      </div>
    );
  }, [iconCls, leftIcon]);

  const renderRightIcon = useMemo(() => {
    return (
      <div className={iconContainerCls({ class: 'pr-4 right-0' })}>
        {cloneIcon(rightIcon, { className: iconCls(), ariaHidden: true })}
      </div>
    );
  }, [rightIcon, iconCls]);

  const renderHelperText = useMemo(
    () => (
      <div className={helperTextCls()}>
        {state &&
          cloneIcon(<WarningIcon className={helperIconCls()} />, {
            ariaHidden: true,
          })}
        <p>{helperText}</p>
      </div>
    ),
    [state, helperText, helperTextCls],
  );

  return (
    <div className="space-y-2">
      {renderLabels}
      <div className={containerCls({ class: className })}>
        {leftIcon && renderLeftIcon}
        <input
          className={cn(inputCls({ class: 'w-80' }), {
            'pl-10': leftIcon,
          })}
          {...props}
        />
        {rightIcon && renderRightIcon}
      </div>
      {renderHelperText}
    </div>
  );
};
