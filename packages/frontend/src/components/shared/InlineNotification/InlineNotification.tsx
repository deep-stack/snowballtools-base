import { ReactNode, useCallback } from 'react';
import { ComponentPropsWithoutRef } from 'react';
import {
  InlineNotificationTheme,
  inlineNotificationTheme,
} from './InlineNotification.theme';
import { InfoSquareIcon } from 'components/shared/CustomIcon';
import { cloneIcon } from 'utils/cloneIcon';

export interface InlineNotificationProps
  extends ComponentPropsWithoutRef<'div'>,
    InlineNotificationTheme {
  /**
   * The title of the notification
   */
  title: string;
  /**
   * The description of the notification
   */
  description?: string;
  /**
   * The icon to display in the notification
   * @default <InfoSquareIcon />
   */
  icon?: ReactNode;
}

/**
 * A notification that is displayed inline with the content
 *
 * @example
 * ```tsx
 * <InlineNotification title="Notification title goes here" />
 * ```
 */
export const InlineNotification = ({
  className,
  title,
  description,
  size,
  variant,
  icon,
  ...props
}: InlineNotificationProps) => {
  const {
    wrapper,
    content,
    title: titleClass,
    description: descriptionClass,
    icon: iconClass,
  } = inlineNotificationTheme({ size, variant, hasDescription: !!description });

  // Render custom icon or default icon
  const renderIcon = useCallback(() => {
    if (!icon) return <InfoSquareIcon className={iconClass()} />;
    return cloneIcon(icon, { className: iconClass() });
  }, [icon]);

  return (
    <div {...props} className={wrapper({ className })}>
      {renderIcon()}
      <div className={content()}>
        <p className={titleClass()}>{title}</p>
        {description && <p className={descriptionClass()}>{description}</p>}
      </div>
    </div>
  );
};
