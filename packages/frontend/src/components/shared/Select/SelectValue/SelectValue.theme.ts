import { tv, VariantProps } from 'tailwind-variants';

export const selectValueTheme = tv({
  slots: {
    wrapper: [
      'flex',
      'items-center',
      'gap-1',
      'pl-2',
      'pr-2',
      'rounded-md',
      'text-elements-mid-em',
      'bg-base-bg-emphasized',
      'hover:bg-base-bg-emphasized/80',
    ],
    icon: ['h-3.5', 'w-3.5'],
  },
  variants: {
    size: {
      sm: {
        wrapper: ['pl-1', 'pr-0.5', 'gap-0.5'],
      },
      md: {
        wrapper: ['pl-2', 'pr-1', 'gap-1'],
      },
    },
  },
});

export type SelectValueTheme = VariantProps<typeof selectValueTheme>;
