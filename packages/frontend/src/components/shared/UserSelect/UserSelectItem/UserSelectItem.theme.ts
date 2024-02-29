import { tv, VariantProps } from 'tailwind-variants';

export const userSelectItemTheme = tv({
  slots: {
    wrapper: [
      'p-2',
      'gap-3',
      'flex',
      'items-center',
      'justify-between',
      'rounded-lg',
      'cursor-pointer',
    ],
    content: ['flex', 'gap-3', 'items-center'],
    img: ['h-10', 'w-10', 'rounded-lg'],
    selectedIcon: ['h-5', 'w-5', 'text-controls-primary'],
    label: ['text-sm', 'text-elements-high-em', 'tracking-[-0.006em]'],
  },
  variants: {
    active: {
      true: {
        wrapper: ['bg-base-bg-emphasized'],
      },
    },
  },
});

export type UserSelectItemTheme = VariantProps<typeof userSelectItemTheme>;
