import { tv, type VariantProps } from 'tailwind-variants';

export type TabsVariants = VariantProps<typeof tabsTheme>;

export const tabsTheme = tv({
  slots: {
    root: ['flex', 'data-[orientation=horizontal]:w-full'],
    triggerWrapper: [
      // Horizontal – default
      'px-1',
      'cursor-default',
      'select-none',
      'text-elements-low-em',
      'border-b-2',
      'border-transparent',
      'hover:border-border-interactive/10',
      'hover:text-elements-mid-em',
      'focus-within:border-border-interactive/10',
      'data-[state=active]:font-medium',
      'data-[state=active]:text-elements-high-em',
      'data-[state=active]:border-elements-high-em',
      // Vertical
      'data-[orientation=vertical]:px-3',
      'data-[orientation=vertical]:py-3',
      'data-[orientation=vertical]:w-full',
      'data-[orientation=vertical]:focus-ring',
      'data-[orientation=vertical]:rounded-xl',
      'data-[orientation=vertical]:border-transparent',
      'data-[orientation=vertical]:hover:bg-base-bg-emphasized',
      'data-[orientation=vertical]:hover:text-elements-mid-em',
      'data-[orientation=vertical]:hover:border-transparent',
      'data-[orientation=vertical]:focus-visible:border-transparent',
      'data-[orientation=vertical]:focus-visible:bg-base-bg-emphasized',
      'data-[orientation=vertical]:focus-visible:text-elements-mid-em',
      'data-[orientation=vertical]:data-[state=active]:font-normal',
      'data-[orientation=vertical]:data-[state=active]:bg-base-bg-emphasized',
      'data-[orientation=vertical]:data-[state=active]:border-transparent',
      'data-[orientation=vertical]:data-[state=active]:hover:text-elements-high-em',
      'data-[orientation=vertical]:data-[state=active]:focus-visible:text-elements-high-em',
      // TODO: demo additions
      'data-[orientation=vertical]:data-[state=active]:bg-snowball-200',
      'data-[orientation=vertical]:data-[state=active]:hover:bg-snowball-200',
      'data-[orientation=vertical]:data-[state=active]:text-snowball-800',
      'data-[orientation=vertical]:data-[state=active]:hover:text-snowball-800',
      'data-[orientation=vertical]:data-[state=active]:shadow-[0px_1px_0px_0px_rgba(8,47,86,0.06)_inset]',
    ],
    trigger: [
      'flex',
      'gap-1.5',
      'cursor-default',
      'select-none',
      'items-center',
      'justify-center',
      'outline-none',
      'leading-none',
      'tracking-[-0.006em]',
      'text-sm',
      'rounded-md',
      // Horizontal – default
      'data-[orientation=horizontal]:focus-ring',
      'data-[orientation=horizontal]:h-10',
      // select direct child of data-[orientation=horizontal]
      '[&[data-orientation=horizontal]_>_*]:h-full',
      // Vertical
      'data-[orientation=vertical]:gap-2',
      'data-[orientation=vertical]:justify-start',
    ],
    triggerList: [
      'flex',
      'shrink-0',
      'gap-5',
      'border-b',
      'border-transparent',
      'overflow-auto',
      // Horizontal – default
      'data-[orientation=horizontal]:border-border-interactive/10',
      // Vertical
      'data-[orientation=vertical]:flex-col',
      'data-[orientation=vertical]:gap-0.5',
      'data-[orientation=vertical]:w-full',
    ],
    content: ['text-elements-high-em', 'grow', 'outline-none', 'tab-content'],
  },
  variants: {
    fillWidth: {
      true: {
        trigger: ['flex-1'],
      },
    },
  },
  defaultVariants: {
    fillWidth: false,
  },
});

export type TabsTheme = VariantProps<typeof tabsTheme>;
