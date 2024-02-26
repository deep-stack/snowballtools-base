import React from 'react';
import { ComponentPropsWithoutRef } from 'react';
import { BadgeTheme, badgeTheme } from './Badge.theme';

export interface BadgeProps
  extends ComponentPropsWithoutRef<'div'>,
    BadgeTheme {}

/**
 * A badge is a small status descriptor for UI elements.
 * It can be used to indicate a status, a count, or a category.
 * It is typically used in lists, tables, or navigation elements.
 *
 * @example
 * ```tsx
 * <Badge variant="primary" size="sm">1</Badge
 * ```
 */
export const Badge = ({
  className,
  children,
  variant,
  size,
  ...props
}: BadgeProps) => {
  const { wrapper } = badgeTheme();

  return (
    <div {...props} className={wrapper({ className, variant, size })}>
      {children}
    </div>
  );
};
