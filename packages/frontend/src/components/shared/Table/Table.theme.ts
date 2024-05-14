import { tv, VariantProps } from 'tailwind-variants';

export const tableTheme = tv({
  slots: {
    root: ['min-w-full', 'border-collapse'],
    header: [
      'p-2',
      'border-b',
      'border-sky-950/opacity-5',
      'text-sky-950',
      'text-sm',
      'font-medium',
      'leading-tight',
    ],
    body: [],
    row: ['border-b', 'border-sky-950/opacity-5'],
    columnHeaderCell: [
      'p-4',
      'text-sky-950',
      'text-sm',
      'font-medium',
      'uppercase',
      'tracking-wider',
      'text-left',
    ],
    rowHeaderCell: [
      'p-4',
      'text-slate-600',
      'text-sm',
      'font-normal',
      'leading-tight',
      'text-left',
    ],
    cell: [
      'p-4',
      'whitespace-nowrap',
      'text-sm',
      'text-slate-600',
      'font-normal',
      'text-left',
    ],
  },
  variants: {},
  defaultVariants: {
    orientation: 'vertical',
  },
});

export type TableTheme = VariantProps<typeof tableTheme>;
