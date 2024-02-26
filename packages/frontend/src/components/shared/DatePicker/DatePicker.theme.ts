import { VariantProps, tv } from 'tailwind-variants';

export const datePickerTheme = tv({
  slots: {
    input: [],
  },
});

export type DatePickerTheme = VariantProps<typeof datePickerTheme>;
