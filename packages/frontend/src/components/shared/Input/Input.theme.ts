import { VariantProps, tv } from 'tailwind-variants';

export const inputTheme = tv(
  {
    slots: {
      container: [
        'flex',
        'items-center',
        'rounded-lg',
        'relative',
        'placeholder:text-elements-disabled',
        'disabled:cursor-not-allowed',
        'disabled:bg-controls-disabled',
      ],
      label: ['text-sm', 'text-elements-high-em'],
      description: ['text-xs', 'text-elements-low-em'],
      input: [
        'focus-ring',
        'block',
        'w-full',
        'h-full',
        'shadow-sm',
        'border',
        'rounded-lg',
        'text-elements-mid-em',
        'border-border-interactive',
        'disabled:shadow-none',
        'disabled:border-none',
      ],
      icon: ['text-elements-mid-em'],
      iconContainer: [
        'absolute',
        'inset-y-0',
        'flex',
        'items-center',
        'z-10',
        'cursor-pointer',
      ],
      helperIcon: [],
      helperText: ['flex', 'gap-2', 'items-center', 'text-elements-danger'],
    },
    variants: {
      state: {
        default: {
          input: '',
        },
        error: {
          input: [
            'outline',
            'outline-offset-0',
            'outline-border-danger',
            'shadow-none',
            'focus:outline-border-danger',
          ],
          helperText: 'text-elements-danger',
        },
      },
      size: {
        md: {
          container: 'h-11',
          input: ['text-sm pl-4 pr-4'],
          icon: ['h-[18px] w-[18px]'],
          helperText: 'text-sm',
          helperIcon: ['h-5 w-5'],
        },
        sm: {
          container: 'h-8',
          input: ['text-xs pl-3 pr-3'],
          icon: ['h-4 w-4'],
          helperText: 'text-xs',
          helperIcon: ['h-4 w-4'],
        },
      },
      appearance: {
        borderless: {
          input: [
            'border-none', // Remove the border
            'shadow-none', // Optional: remove shadow if desired
            // Add any additional styles necessary for the borderless appearance
          ],
        },
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  },
  {
    responsiveVariants: true,
  },
);

export type InputTheme = VariantProps<typeof inputTheme>;
