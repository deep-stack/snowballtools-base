import { VariantProps, tv } from 'tailwind-variants';

export const datePickerTheme = tv({
  slots: {
    input: ['w-full'],
  },
});

export type DatePickerTheme = VariantProps<typeof datePickerTheme>;
