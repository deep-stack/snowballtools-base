import React, {
  type ReactNode,
  type ComponentPropsWithoutRef,
  useMemo,
} from 'react';
import { tagTheme, type TagTheme } from './Tag.theme';
import { cloneIcon } from 'utils/cloneIcon';

type TagProps = ComponentPropsWithoutRef<'div'> &
  TagTheme & {
    /**
     * The optional left icon element for a component.
     * @type {ReactNode}
     */
    leftIcon?: ReactNode;
    /**
     * The optional right icon element to display.
     * @type {ReactNode}
     */
    rightIcon?: ReactNode;
  };

export const Tag = ({
  children,
  leftIcon,
  rightIcon,
  type = 'attention',
  style = 'default',
  size = 'sm',
}: TagProps) => {
  const {
    wrapper: wrapperCls,
    icon: iconCls,
    label: labelCls,
  } = tagTheme({
    type,
    style,
    size,
  });

  const renderLeftIcon = useMemo(() => {
    if (!leftIcon) return null;
    return <div className={iconCls()}>{cloneIcon(leftIcon, { size: 16 })}</div>;
  }, [cloneIcon, iconCls, leftIcon]);

  const renderRightIcon = useMemo(() => {
    if (!rightIcon) return null;
    return (
      <div className={iconCls()}>{cloneIcon(rightIcon, { size: 16 })}</div>
    );
  }, [cloneIcon, iconCls, rightIcon]);

  return (
    <div className={wrapperCls()}>
      {renderLeftIcon}
      <p className={labelCls()}>{children}</p>
      {renderRightIcon}
    </div>
  );
};
