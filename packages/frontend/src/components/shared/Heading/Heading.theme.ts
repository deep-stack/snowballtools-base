import { tv, type VariantProps } from 'tailwind-variants';

export const headingTheme = tv({
  base: ['text-elements-high-em', 'font-display', 'font-normal'],
});

export type HeadingVariants = VariantProps<typeof headingTheme>;
