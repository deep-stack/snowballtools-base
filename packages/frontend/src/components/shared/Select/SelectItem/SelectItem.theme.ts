import { tv, VariantProps } from 'tailwind-variants';

export const selectItemTheme = tv({
  slots: {
    wrapper: [
      'p-2',
      'gap-3',
      'flex',
      'items-start',
      'justify-between',
      'rounded-lg',
      'group',
      'data-[disabled]:cursor-not-allowed',
    ],
    icon: ['h-4.5', 'w-4.5', 'text-elements-high-em'],
    content: ['flex', 'flex-1', 'whitespace-nowrap'],
    label: [
      'text-sm',
      'text-elements-high-em',
      'tracking-[-0.006em]',
      'data-[disabled]:text-elements-disabled',
    ],
    description: [
      'text-xs',
      'text-elements-low-em',
      'data-[disabled]:text-elements-disabled',
    ],
    dot: ['h-1', 'w-1', 'rounded-full', 'bg-border-interactive-hovered/[0.14]'],
  },
  variants: {
    orientation: {
      horizontal: {
        wrapper: ['items-center'],
        content: ['flex-row', 'items-center', 'gap-2'],
      },
      vertical: {
        content: ['flex-col', 'gap-0.5'],
      },
    },
    variant: {
      default: {
        wrapper: [],
      },
      danger: {
        wrapper: [],
      },
    },
    active: {
      true: {
        wrapper: ['bg-base-bg-emphasized', 'data-[disabled]:bg-transparent'],
      },
    },
  },
});

export type SelectItemTheme = VariantProps<typeof selectItemTheme>;
