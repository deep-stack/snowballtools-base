import React, { ComponentPropsWithoutRef, useMemo } from 'react';
import { cn } from 'utils/classnames';

type WaveBorderVariant = 'stroke' | 'stroke-and-fill';

export interface WavyBorderProps extends ComponentPropsWithoutRef<'div'> {
  variant?: WaveBorderVariant;
}

export const WavyBorder = ({
  className,
  variant = 'stroke',
  ...props
}: WavyBorderProps) => {
  const imageSrc = useMemo(() => {
    switch (variant) {
      case 'stroke-and-fill':
        return '/wavy-border-line-and-fill.svg';
      case 'stroke':
      default:
        return '/wavy-border-line.svg';
    }
  }, [variant]);

  return (
    <div
      {...props}
      className={cn(className)}
      style={{
        // If adding background beneath the wave, we use mask
        mask: `url(/wavy-border-fill.svg) repeat-x top`,
        WebkitMask: `url(/wavy-border-fill.svg) repeat-x top`,
      }}
    >
      {/* Wave */}
      <div
        className="h-1 w-full bg-repeat-x bg-top"
        style={{
          backgroundImage: `url(${imageSrc})`,
        }}
      />
    </div>
  );
};
