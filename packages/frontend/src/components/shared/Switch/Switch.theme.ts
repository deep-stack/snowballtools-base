import { tv, type VariantProps } from 'tailwind-variants';

export const switchTheme = tv({
  slots: {
    wrapper: ['flex', 'items-start', 'gap-4', 'w-[375px]'],
    switch: [
      'h-6',
      'w-12',
      'rounded-full',
      'transition-all',
      'duration-500',
      'relative',
      'cursor-default',
      'shadow-inset',
      'focus-ring',
      'outline-none',
    ],
    thumb: [
      'block',
      'h-4',
      'w-4',
      'translate-x-1',
      'transition-transform',
      'duration-100',
      'will-change-transform',
      'rounded-full',
      'shadow-button',
      'data-[state=checked]:translate-x-7',
      'bg-controls-elevated',
    ],
    label: [
      'flex',
      'flex-1',
      'flex-col',
      'px-1',
      'gap-1',
      'text-sm',
      'text-elements-high-em',
      'tracking-[-0.006em]',
    ],
    description: ['text-xs', 'text-elements-low-em'],
  },
  variants: {
    checked: {
      true: {
        switch: [
          'bg-controls-primary',
          'hover:bg-controls-primary-hovered',
          'focus-visible:bg-controls-primary-hovered',
        ],
      },
      false: {
        switch: [
          'bg-controls-inset',
          'hover:bg-controls-inset-hovered',
          'focus-visible:bg-controls-inset-hovered',
        ],
      },
    },
    disabled: {
      true: {
        switch: ['bg-controls-disabled', 'cursor-not-allowed'],
        thumb: ['bg-elements-on-disabled'],
      },
    },
    fullWidth: {
      true: {
        wrapper: ['w-full', 'justify-between'],
      },
    },
  },
  compoundVariants: [
    {
      checked: true,
      disabled: true,
      class: {
        switch: ['bg-controls-disabled-active'],
        thumb: ['bg-snowball-900'],
      },
    },
  ],
});

export type SwitchVariants = VariantProps<typeof switchTheme>;
