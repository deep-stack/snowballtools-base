import { tv, VariantProps } from 'tailwind-variants';

export const userSelectTheme = tv({
  slots: {
    container: ['flex', 'flex-col', 'relative', 'gap-2'],
    inputWrapper: [
      'relative',
      'flex',
      'flex-wrap',
      'gap-1',
      'min-w-[200px]',
      'w-full',
      'rounded-lg',
      'bg-transparent',
      'text-elements-mid-em',
      'shadow-sm',
      'border',
      'border-border-interactive',
      'focus-ring',
      'disabled:shadow-none',
      'disabled:border-none',
    ],
    input: ['outline-none'],
    popover: [
      'mt-12',
      'z-20',
      'absolute',
      'px-1',
      'py-1',
      'flex-col',
      'gap-0.5',
      'min-w-full',
      'bg-surface-floating',
      'shadow-dropdown',
      'w-auto',
      'max-h-60',
      'overflow-auto',
      'border',
      'border-gray-200',
      'rounded-xl',
    ],
  },
  variants: {
    isOpen: {
      true: {
        popover: ['flex'],
      },
      false: {
        popover: ['hidden'],
      },
    },
    hasValue: {
      true: '',
    },
  },
});

export type UserSelectTheme = VariantProps<typeof userSelectTheme>;
