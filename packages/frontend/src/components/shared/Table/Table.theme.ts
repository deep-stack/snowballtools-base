interface ThemeProps {
  base: string;
  header: string;
  row: string;
  columnHeaderCell: string;
  rowHeaderCell: string;
  cell: string;
}

const primaryTheme: ThemeProps = {
  base: 'min-w-full border-collapse',
  header: 'border-b border-sky-950/opacity-5 font-medium leading-tight',
  row: 'border-b border-sky-950/opacity-5',
  columnHeaderCell:
    'p-4 text-sky-950 text-sm font-medium uppercase tracking-wider text-left',
  rowHeaderCell:
    'p-4 text-slate-600 text-sm font-normal leading-tight text-left',
  cell: 'p-4 whitespace-nowrap text-sm text-slate-600 font-normal text-left',
};

const secondaryTheme: ThemeProps = {
  base: 'min-w-full border-collapse',
  header:
    'p-2 border-b border-sky-950/5 text-sky-950 text-sm font-medium leading-tight',
  row: 'text-left border-b border-gray-300/50',
  columnHeaderCell:
    'px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-800',
  rowHeaderCell: 'px-6 py-4 font-medium whitespace-nowrap text-gray-800',
  cell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-600',
};

export const tableTheme = {
  primary: primaryTheme,
  secondary: secondaryTheme,
};
