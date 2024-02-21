import { Button, ButtonTheme } from 'components/shared/Button';
import { PlusIcon } from 'components/shared/CustomIcon';
import React from 'react';

export const renderButtons = () => {
  return ['primary', 'secondary', 'tertiary', 'danger'].map(
    (variant, index) => (
      <div className="flex gap-5 flex-wrap" key={index}>
        {['lg', 'md', 'sm', 'xs', 'disabled'].map((size) => (
          <Button
            leftIcon={<PlusIcon />}
            rightIcon={<PlusIcon />}
            variant={variant as ButtonTheme['variant']}
            size={size !== 'disabled' ? (size as ButtonTheme['size']) : 'md'}
            key={`${variant}-${size}`}
            disabled={size === 'disabled'}
          >
            Button
          </Button>
        ))}
      </div>
    ),
  );
};

export const renderButtonIcons = () => {
  return [
    'primary',
    'secondary',
    'tertiary',
    'ghost',
    'danger',
    'danger-ghost',
  ].map((variant, index) => (
    <div className="flex gap-5 flex-wrap" key={index}>
      {['lg', 'md', 'sm', 'xs', 'disabled'].map((size) => (
        <Button
          iconOnly
          variant={variant as ButtonTheme['variant']}
          size={size !== 'disabled' ? (size as ButtonTheme['size']) : 'md'}
          key={`${variant}-${size}`}
          disabled={size === 'disabled'}
        >
          <PlusIcon />
        </Button>
      ))}
    </div>
  ));
};
