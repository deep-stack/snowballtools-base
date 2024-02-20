import { VariantProps, tv } from 'tailwind-variants';

export const calendarTheme = tv({
  slots: {
    wrapper: [
      'max-w-[352px]',
      'bg-surface-floating',
      'shadow-calendar',
      'rounded-xl',
    ],
    calendar: ['flex', 'flex-col', 'py-2', 'px-2', 'gap-2'],
    navigation: [
      'flex',
      'items-center',
      'justify-between',
      'gap-3',
      'py-2.5',
      'px-1',
    ],
    dropdowns: ['flex', 'items-center', 'justify-center', 'gap-1.5', 'flex-1'],
    dropdown: [
      'flex',
      'items-center',
      'gap-2',
      'px-2',
      'py-2',
      'rounded-lg',
      'border',
      'border-border-interactive',
      'text-elements-high-em',
      'shadow-field',
      'bg-white',
      'hover:bg-base-bg-alternate',
      'focus-visible:bg-base-bg-alternate',
    ],
    footer: [
      'flex',
      'items-center',
      'justify-end',
      'py-3',
      'px-2',
      'gap-3',
      'border-t',
      'border-border-separator',
    ],
  },
});

export type CalendarTheme = VariantProps<typeof calendarTheme>;
