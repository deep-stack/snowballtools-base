import { VariantProps, tv } from 'tailwind-variants';

export const radioTheme = tv({
  slots: {
    root: ['flex', 'gap-3', 'flex-wrap'],
    wrapper: ['flex', 'items-center', 'gap-2', 'group'],
    label: ['text-sm', 'tracking-[-0.006em]', 'text-elements-high-em'],
    radio: [
      'w-5',
      'h-5',
      'rounded-full',
      'border',
      'group',
      'border-border-interactive/10',
      'shadow-button',
      'group-hover:border-border-interactive/[0.14]',
      'focus-ring',
      // Checked
      'data-[state=checked]:bg-controls-primary',
      'data-[state=checked]:group-hover:bg-controls-primary-hovered',
    ],
    indicator: [
      'flex',
      'items-center',
      'justify-center',
      'relative',
      'w-full',
      'h-full',
      'after:content-[""]',
      'after:block',
      'after:w-2.5',
      'after:h-2.5',
      'after:rounded-full',
      'after:bg-transparent',
      'after:group-hover:bg-controls-disabled',
      'after:group-focus-visible:bg-controls-disabled',
      // Checked
      'after:data-[state=checked]:bg-elements-on-primary',
      'after:data-[state=checked]:group-hover:bg-elements-on-primary',
      'after:data-[state=checked]:group-focus-visible:bg-elements-on-primary',
    ],
  },
  variants: {
    orientation: {
      vertical: { root: ['flex-col'] },
      horizontal: { root: ['flex-row'] },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export type RadioTheme = VariantProps<typeof radioTheme>;