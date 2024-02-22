import { VariantProps, tv } from 'tailwind-variants';

export const simpleToastTheme = tv(
  {
    slots: {
      wrapper: [
        'flex',
        'py-2',
        'pl-2',
        'pr-1.5',
        'gap-2',
        'rounded-full',
        'mx-auto',
        'mt-3',
        'w-fit',
        'overflow-hidden',
        'bg-surface-high-contrast',
        'shadow-sm',
      ],
      icon: ['flex', 'items-center', 'justify-center', 'w-5', 'h-5'],
      title: ['text-sm', 'text-elements-on-high-contrast'],
    },
    variants: {
      variant: {
        success: {
          icon: ['text-elements-success'],
        },
        error: {
          icon: ['text-elements-danger'],
        },
        warning: {
          icon: ['text-elements-warning'],
        },
        info: {
          icon: ['text-elements-info'],
        },
        loading: {
          icon: ['text-elements-info'],
        },
      },
    },
  },
  {
    responsiveVariants: true,
  },
);

export type SimpleToastTheme = VariantProps<typeof simpleToastTheme>;
