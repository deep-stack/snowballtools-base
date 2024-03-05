import { VariantProps, tv } from 'tailwind-variants';

export const stepTheme = tv({
  slots: {
    wrapper: ['relative', 'px-1.5', 'py-1.5', 'flex', 'gap-2', 'items-center'],
    step: [
      'bg-base-bg-emphasized',
      'rounded-full',
      'w-7',
      'h-7',
      'flex',
      'items-center',
      'justify-center',
      'text-elements-mid-em',
      'shadow-button',
      'shrink-0',
    ],
    label: [
      'text-sm',
      'font-sans',
      'text-elements-mid-em',
      'whitespace-nowrap',
    ],
    connector: [],
  },
  variants: {
    orientation: {
      vertical: {
        connector: ['bg-border-interactive-hovered', 'w-px', 'h-3', 'ml-5'],
      },
      horizontal: {
        connector: ['text-border-interactive-hovered', 'h-3', 'w-3'],
      },
    },
    active: {
      true: {
        step: ['bg-controls-secondary-hovered', 'text-elements-on-secondary'],
        label: ['text-elements-high-em'],
      },
    },
    completed: {
      true: {
        step: ['text-controls-primary'],
      },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export type StepTheme = VariantProps<typeof stepTheme>;
