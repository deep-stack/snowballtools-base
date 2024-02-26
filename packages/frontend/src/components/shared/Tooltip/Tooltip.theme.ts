import { tv } from 'tailwind-variants';

export const tooltipTheme = tv({
  slots: {
    content: [
      'z-tooltip',
      'rounded-md',
      'bg-surface-high-contrast',
      'p-2',
      'text-elements-on-high-contrast',
    ],
    arrow: ['fill-surface-high-contrast'],
  },
});
