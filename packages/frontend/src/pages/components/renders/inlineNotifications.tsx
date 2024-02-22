import { InlineNotification } from 'components/shared/InlineNotification';
import { InlineNotificationTheme } from 'components/shared/InlineNotification/InlineNotification.theme';
import React from 'react';

const inlineNotificationVariants = [
  'info',
  'danger',
  'warning',
  'success',
  'generic',
];
const inlineNotificationSizes = ['md', 'sm'];

export const renderInlineNotifications = () => {
  return inlineNotificationVariants.map((variant) => (
    <div className="space-y-2" key={variant}>
      {inlineNotificationSizes.map((size) => (
        <InlineNotification
          size={size as InlineNotificationTheme['size']}
          variant={variant as InlineNotificationTheme['variant']}
          key={`${variant}-${size}`}
          title="Notification title goes here"
        />
      ))}
    </div>
  ));
};

export const renderInlineNotificationWithDescriptions = () => {
  return inlineNotificationVariants.map((variant) => (
    <div className="space-y-2" key={variant}>
      {inlineNotificationSizes.map((size) => (
        <InlineNotification
          size={size as InlineNotificationTheme['size']}
          variant={variant as InlineNotificationTheme['variant']}
          key={`${variant}-${size}`}
          title="Notification title goes here"
          description="Description goes here"
        />
      ))}
    </div>
  ));
};
