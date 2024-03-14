import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const modalTheme = tv({
  slots: {
    overlay: [
      'z-modal',
      'fixed',
      'inset-0',
      'bg-black/80',
      'backdrop-blur-sm',
      'overflow-y-auto',
      'flex',
      'justify-center',
      'items-end',
      'sm:items-center',
      'p-0',
      'sm:p-10',
      'data-[state=closed]:animate-[dialog-overlay-hide_200ms]',
      'data-[state=open]:animate-[dialog-overlay-show_200ms]',
      'data-[state=closed]:hidden', // Fix overlay not close when modal is closed
    ],
    close: ['absolute', 'right-4', 'top-2', 'sm:right-6', 'sm:top-3', 'z-[1]'],
    header: [
      'flex',
      'flex-col',
      'gap-4',
      'items-start',
      'px-4',
      'py-4',
      'sm:px-6',
      'sm:py-5',
      'bg-base-bg-alternate',
    ],
    headerTitle: [
      'text-base',
      'sm:text-lg',
      'tracking-[0.011em]',
      'sm:tracking-normal',
      'text-elements-high-em',
    ],
    headerDescription: ['text-sm', 'text-elements-low-em'],
    footer: ['flex', 'gap-3', 'px-4', 'pb-4', 'pt-7', 'sm:pb-6', 'sm:px-6'],
    content: [
      'h-fit',
      'sm:min-h-0',
      'sm:m-auto',
      'relative',
      'flex',
      'flex-col',
      'overflow-hidden',
      'w-full',
      'sm:max-w-[562px]',
      'rounded-2xl',
      'bg-base-bg',
      'shadow-card',
      'text-elements-high-em',
    ],
    body: ['flex-1', 'px-4', 'pt-4', 'sm:pt-6', 'sm:px-6'],
  },
  variants: {
    fullPage: {
      true: {
        content: ['h-full'],
        overlay: ['!p-0'],
      },
    },
  },
  defaultVariants: {
    fullPage: false,
  },
});
export type ModalVariants = VariantProps<typeof modalTheme>;
