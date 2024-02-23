import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Defines the theme for a segmented controls.
 */
export const segmentedControlsTheme = tv({
  slots: {
    parent: [
      'flex',
      'items-center',
      'bg-base-bg-emphasized',
      'gap-0.5',
      'rounded-lg',
    ],
    item: [
      'flex',
      'items-center',
      'justify-center',
      'gap-2',
      'text-elements-mid-em',
      'bg-transparent',
      'border',
      'border-transparent',
      'cursor-default',
      'whitespace-nowrap',
      'rounded-lg',
      'focus-ring',
      'hover:bg-controls-tertiary-hovered',
      'focus-visible:z-20',
      'focus-visible:bg-controls-tertiary-hovered',
      'disabled:text-controls-disabled',
      'disabled:bg-transparent',
      'disabled:cursor-not-allowed',
      'disabled:border-transparent',
      'data-[active=true]:bg-controls-tertiary',
      'data-[active=true]:text-elements-high-em',
      'data-[active=true]:border-border-interactive/10',
      'data-[active=true]:shadow-field',
      'data-[active=true]:hover:bg-controls-tertiary-hovered',
    ],
    icon: [],
  },
  variants: {
    size: {
      sm: {
        item: ['px-3', 'py-2', 'text-xs'],
        icon: ['h-4', 'w-4'],
      },
      md: {
        item: ['px-4', 'py-3', 'text-sm', 'tracking-[-0.006em]'],
        icon: ['h-5', 'w-5'],
      },
    },
    type: {
      'fixed-width': {
        parent: ['w-fit'],
        item: ['w-fit'],
      },
      'full-width': {
        parent: ['w-full'],
        item: ['w-full'],
      },
    },
  },
  defaultVariants: {
    size: 'md',
    type: 'fixed-width',
  },
});

/**
 * Defines the type for the variants of a segmented controls.
 */
export type SegmentedControlsVariants = VariantProps<
  typeof segmentedControlsTheme
>;
