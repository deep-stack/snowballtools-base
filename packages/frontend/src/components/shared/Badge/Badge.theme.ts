import { VariantProps, tv } from 'tailwind-variants';

export const badgeTheme = tv({
  slots: {
    wrapper: ['rounded-full', 'grid', 'place-content-center'],
  },
  variants: {
    variant: {
      primary: {
        wrapper: ['bg-controls-primary', 'text-elements-on-primary'],
      },
      secondary: {
        wrapper: ['bg-controls-secondary', 'text-elements-on-secondary'],
      },
      tertiary: {
        wrapper: [
          'bg-controls-tertiary',
          'border',
          'border-border-interactive/10',
          'text-elements-high-em',
          'shadow-button',
        ],
      },
      inset: {
        wrapper: ['bg-controls-inset', 'text-elements-high-em'],
      },
    },
    size: {
      sm: {
        wrapper: ['h-5', 'w-5', 'text-xs'],
      },
      xs: {
        wrapper: ['h-4', 'w-4', 'text-2xs', 'font-medium'],
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'sm',
  },
});

export type BadgeTheme = VariantProps<typeof badgeTheme>;
