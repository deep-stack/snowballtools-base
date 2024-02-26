import { tv, type VariantProps } from 'tailwind-variants';

export const getCheckboxVariant = tv({
  slots: {
    wrapper: ['group', 'flex', 'gap-3'],
    indicator: [
      'grid',
      'place-content-center',
      'text-transparent',
      'group-hover:text-controls-disabled',
      'focus-visible:text-controls-disabled',
      'group-focus-visible:text-controls-disabled',
      'data-[state=checked]:text-elements-on-primary',
      'data-[state=checked]:group-focus-visible:text-elements-on-primary',
      'data-[state=indeterminate]:text-elements-on-primary',
      'data-[state=checked]:data-[disabled]:text-elements-on-disabled-active',
    ],
    icon: ['w-3', 'h-3', 'stroke-current', 'text-current'],
    input: [
      'h-5',
      'w-5',
      'group',
      'border',
      'border-border-interactive/10',
      'bg-controls-tertiary',
      'rounded-md',
      'transition-all',
      'duration-150',
      'focus-ring',
      'shadow-button',
      'group-hover:border-border-interactive/[0.14]',
      'group-hover:bg-controls-tertiary',
      'data-[state=checked]:bg-controls-primary',
      'data-[state=checked]:hover:bg-controls-primary-hovered',
      'data-[state=checked]:focus-visible:bg-controls-primary-hovered',
      'data-[disabled]:bg-controls-disabled',
      'data-[disabled]:shadow-none',
      'data-[disabled]:hover:border-border-interactive/10',
      'data-[disabled]:cursor-not-allowed',
      'data-[state=checked]:data-[disabled]:bg-controls-disabled-active',
    ],
    label: [
      'text-sm',
      'tracking-[-0.006em]',
      'text-elements-high-em',
      'flex',
      'flex-col',
      'gap-1',
      'px-1',
    ],
    description: ['text-xs', 'text-elements-low-em'],
  },
  variants: {
    disabled: {
      true: {
        wrapper: ['cursor-not-allowed'],
        indicator: ['group-hover:text-transparent'],
        input: [
          'group-hover:border-border-interactive/[0.14]',
          'group-hover:bg-controls-disabled',
        ],
        label: ['cursor-not-allowed'],
      },
    },
  },
});

export type CheckboxVariants = VariantProps<typeof getCheckboxVariant>;
