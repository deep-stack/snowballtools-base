import { VariantProps, tv } from 'tailwind-variants';

export const selectTheme = tv({
  slots: {
    container: ['flex', 'flex-col', 'relative', 'gap-2'],
    label: ['text-sm', 'text-elements-high-em'],
    description: ['text-xs', 'text-elements-low-em'],
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
    iconContainer: [
      'absolute',
      'inset-y-0',
      'flex',
      'items-center',
      'gap-2',
      'z-10',
      'cursor-pointer',
    ],
    icon: ['text-elements-mid-em'],
    helperIcon: [],
    helperText: ['flex', 'gap-2', 'items-center', 'text-elements-low-em'],
    popover: [
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
    orientation: {
      horizontal: {
        container: [],
      },
      vertical: {
        container: [],
      },
    },
    variant: {
      default: {
        container: [],
      },
      danger: {
        container: [],
      },
    },
    error: {
      true: {
        inputWrapper: [
          'outline',
          'outline-offset-0',
          'outline-border-danger',
          'shadow-none',
          'focus:outline-border-danger',
        ],
        helperText: ['text-elements-danger'],
      },
    },
    size: {
      md: {
        container: ['min-h-11'],
        inputWrapper: ['min-h-11', 'text-sm', 'pl-4', 'pr-4', 'py-1'],
        icon: ['h-[18px]', 'w-[18px]'],
        helperText: 'text-sm',
        helperIcon: ['h-5', 'w-5'],
        popover: ['mt-12'],
      },
      sm: {
        container: ['min-h-8'],
        inputWrapper: ['min-h-8', 'text-xs', 'pl-3', 'pr-3', 'py-0.5'],
        icon: ['h-4', 'w-4'],
        helperText: 'text-xs',
        helperIcon: ['h-4', 'w-4'],
        popover: ['mt-9'],
      },
    },
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
    searchable: {
      true: '',
      false: {
        input: ['cursor-pointer'],
      },
    },
    hideValues: {
      true: {
        input: ['placeholder:text-elements-mid-em'],
      },
    },
  },
  compoundVariants: [
    {
      size: 'md',
      hasValue: true,
      class: {
        inputWrapper: ['pl-1'],
      },
    },
    {
      size: 'sm',
      hasValue: true,
      class: {
        inputWrapper: ['pl-0.5'],
      },
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'default',
    size: 'md',
    state: 'default',
    error: false,
    isOpen: false,
    hasValue: false,
  },
});

export type SelectTheme = VariantProps<typeof selectTheme>;
