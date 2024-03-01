import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const tagTheme = tv(
  {
    slots: {
      wrapper: ['inline-flex', 'gap-1.5', 'rounded-lg', 'border'],
      icon: [],
      label: ['font-inter', 'text-xs'],
    },
    variants: {
      type: {
        attention: {
          wrapper: ['text-elements-warning'],
        },
        negative: {
          wrapper: ['text-elements-danger'],
        },
        positive: {
          wrapper: ['text-elements-success'],
        },
        emphasized: {
          wrapper: ['text-elements-on-secondary'],
        },
        neutral: {
          wrapper: ['text-elements-mid-em'],
        },
      },
      style: {
        default: {},
        minimal: {
          wrapper: ['border-border-interactive', 'bg-controls-tertiary'],
          label: ['text-elements-high-em'],
        },
      },
      size: {
        sm: {
          wrapper: ['px-2', 'py-2'],
          icon: ['h-4', 'w-4'],
        },
        xs: {
          wrapper: ['px-2', 'py-1'],
          icon: ['h-3', 'w-3'],
        },
      },
    },
    compoundVariants: [
      {
        type: 'attention',
        style: 'default',
        class: {
          wrapper: ['border-orange-200', 'bg-orange-50'],
        },
      },
      {
        type: 'negative',
        style: 'default',
        class: {
          wrapper: ['border-rose-200', 'bg-rose-50'],
        },
      },
      {
        type: 'positive',
        style: 'default',
        class: {
          wrapper: ['border-emerald-200', 'bg-emerald-50'],
        },
      },
      {
        type: 'emphasized',
        style: 'default',
        class: {
          wrapper: ['border-snowball-200', 'bg-snowball-50'],
        },
      },
      {
        type: 'neutral',
        style: 'default',
        class: {
          wrapper: ['border-gray-200', 'bg-gray-50'],
        },
      },
    ],
    defaultVariants: {
      type: 'attention',
      style: 'default',
      size: 'sm',
    },
  },
  {
    responsiveVariants: true,
  },
);

export type TagTheme = VariantProps<typeof tagTheme>;
