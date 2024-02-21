import React from 'react';

import { Badge } from 'components/shared/Badge';
import { BadgeTheme } from 'components/shared/Badge/Badge.theme';

export const renderBadges = () => {
  return ['primary', 'secondary', 'tertiary', 'inset'].map((variant, index) => (
    <div className="flex gap-5" key={index}>
      {['sm', 'xs'].map((size) => (
        <Badge
          key={size}
          variant={variant as BadgeTheme['variant']}
          size={size as BadgeTheme['size']}
        >
          1
        </Badge>
      ))}
    </div>
  ));
};
