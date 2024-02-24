import { tv, type VariantProps } from 'tailwind-variants';

export type TabsVariants = VariantProps<typeof tabsTheme>;

export const tabsTheme = tv({
  slots: {
    root: ['flex', 'data-[orientation=horizontal]:w-full'],
    triggerWrapper: [
      // Horizontal – default
      'px-1',
      'pb-5',
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
      'data-[orientation=vertical]:min-w-[240px]',
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
      'rounded-md',
      // Horizontal – default
      'data-[orientation=horizontal]:focus-ring',
      // Vertical
      'data-[orientation=vertical]:gap-2',
    ],
    triggerList: [
      'flex',
      'shrink-0',
      'gap-5',
      'border-b',
      'border-transparent',
      // Horizontal – default
      'data-[orientation=horizontal]:border-border-interactive/10',
      // Vertical
      'data-[orientation=vertical]:flex-col',
      'data-[orientation=vertical]:gap-0.5',
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
