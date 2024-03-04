import { VariantProps, tv } from 'tailwind-variants';

export const stepsTheme = tv({
  slots: {
    root: [],
  },
  variants: {
    orientation: {
      vertical: { root: ['flex', 'flex-col'] },
      horizontal: { root: ['flex', 'items-center'] },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export type StepsTheme = VariantProps<typeof stepsTheme>;
