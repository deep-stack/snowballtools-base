import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const modalTheme = tv({
  slots: {
    overlay: [
      'z-modal',
      'fixed',
      'inset-0',
      'bg-bg-base/90',
      'backdrop-blur-sm',
      'overflow-y-auto',
      'flex',
      'justify-center',
      'items-center',
      'p-6',
      'sm:p-10',
      'data-[state=closed]:animate-[dialog-overlay-hide_200ms]',
      'data-[state=open]:animate-[dialog-overlay-show_200ms]',
      'data-[state=closed]:hidden', // Fix overlay not close when modal is closed
    ],
    close: [
      'absolute',
      'right-6',
      'top-5',
      'sm:right-10',
      'sm:top-[38px]',
      'z-[1]',
    ],
    header: ['flex', 'flex-col', 'gap-2', 'items-start', 'px-6', 'sm:px-10'],
    headerTitle: ['text-lg', 'sm:text-xl', 'text-text-em-high'],
    headerDescription: ['text-sm', 'text-text-em-low'],
    footer: ['flex', 'justify-end', 'gap-3', 'sm:gap-4', 'px-6', 'sm:px-10'],
    content: [
      'h-fit',
      'sm:min-h-0',
      'sm:m-auto',
      'relative',
      'flex',
      'flex-col',
      'gap-y-8',
      'py-6',
      'sm:py-10',
      'overflow-hidden',
      'w-full',
      'max-w-[560px]',
      'rounded-xl',
      'bg-surface-base',
      'border',
      'border-border-base',
      'text-text-em-high',
    ],
    body: ['flex-1', 'px-6', 'sm:px-10'],
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
