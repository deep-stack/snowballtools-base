import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

/**
 * Defines the theme for a button component.
 */
export const buttonTheme = tv(
  {
    base: [
      'h-fit',
      'inline-flex',
      'items-center',
      'justify-center',
      'whitespace-nowrap',
      'focus-ring',
      'disabled:cursor-not-allowed',
      'transition-colors',
      'duration-150',
    ],
    variants: {
      size: {
        lg: ['gap-2', 'py-3.5', 'px-5', 'text-base', 'tracking-[-0.011em]'],
        md: ['gap-2', 'py-3', 'px-5', 'text-sm', 'tracking-[-0.006em]'],
        sm: ['gap-1', 'py-2', 'px-3', 'text-xs'],
        xs: ['gap-1', 'py-1', 'px-2', 'text-xs'],
      },
      fullWidth: {
        true: 'w-full',
      },
      shape: {
        default: 'rounded-lg',
        rounded: 'rounded-full',
      },
      iconOnly: {
        true: '',
      },
      variant: {
        primary: [
          'text-elements-on-primary',
          'border',
          'border-transparent',
          'bg-controls-primary',
          'shadow-button',
          'hover:bg-controls-primary-hovered',
          'focus-visible:bg-controls-primary-hovered',
          'disabled:text-elements-on-disabled',
          'disabled:bg-controls-disabled',
          'disabled:border-transparent',
          'disabled:shadow-none',
        ],
        secondary: [
          'text-elements-on-secondary',
          'border',
          'border-transparent',
          'bg-controls-secondary',
          'hover:bg-controls-secondary-hovered',
          'focus-visible:bg-controls-secondary-hovered',
          'disabled:text-elements-on-disabled',
          'disabled:bg-controls-disabled',
          'disabled:border-transparent',
          'disabled:shadow-none',
        ],
        tertiary: [
          'text-elements-on-tertiary',
          'border',
          'border-border-interactive',
          'bg-controls-tertiary',
          'shadow-button',
          'hover:bg-controls-tertiary-hovered',
          'hover:border-border-interactive-hovered',
          'focus-visible:bg-controls-tertiary-hovered',
          'focus-visible:border-border-interactive-hovered',
          'disabled:text-elements-on-disabled',
          'disabled:bg-controls-disabled',
          'disabled:border-transparent',
          'disabled:shadow-none',
        ],
        ghost: [
          'text-elements-on-tertiary',
          'border',
          'border-transparent',
          'bg-transparent',
          'hover:bg-controls-tertiary-hovered',
          'hover:border-border-interactive-hovered',
          'focus-visible:bg-controls-tertiary-hovered',
          'focus-visible:border-border-interactive-hovered',
          'disabled:text-elements-on-disabled',
          'disabled:bg-controls-disabled',
          'disabled:border-transparent',
          'disabled:shadow-none',
        ],
        danger: [
          'text-elements-on-danger',
          'border',
          'border-transparent',
          'bg-border-danger',
          'hover:bg-controls-danger-hovered',
          'focus-visible:bg-controls-danger-hovered',
          'disabled:text-elements-on-disabled',
          'disabled:bg-controls-disabled',
          'disabled:border-transparent',
          'disabled:shadow-none',
        ],
        'danger-ghost': [
          'text-elements-danger',
          'border',
          'border-transparent',
          'bg-transparent',
          'hover:bg-controls-tertiary-hovered',
          'hover:border-border-interactive-hovered',
          'focus-visible:bg-controls-tertiary-hovered',
          'focus-visible:border-border-interactive-hovered',
          'disabled:text-elements-on-disabled',
          'disabled:bg-controls-disabled',
          'disabled:border-transparent',
          'disabled:shadow-none',
        ],
        link: [
          'p-0',
          'gap-1.5',
          'text-elements-link',
          'rounded',
          'focus-ring',
          'hover:underline',
          'hover:text-elements-link-hovered',
          'disabled:text-controls-disabled',
          'disabled:hover:no-underline',
        ],
        'link-emphasized': [
          'p-0',
          'gap-1.5',
          'text-elements-high-em',
          'rounded',
          'underline',
          'focus-ring',
          'hover:text-elements-link-hovered',
          'disabled:text-controls-disabled',
          'disabled:hover:no-underline',
          'dark:text-elements-on-high-contrast',
        ],
        unstyled: [],
      },
    },
    compoundVariants: [
      {
        size: 'lg',
        iconOnly: true,
        class: ['py-3.5', 'px-3.5'],
      },
      {
        size: 'md',
        iconOnly: true,
        class: ['py-3', 'px-3'],
      },
      {
        size: 'sm',
        iconOnly: true,
        class: ['py-2', 'px-2'],
      },
      {
        size: 'xs',
        iconOnly: true,
        class: ['py-1', 'px-1'],
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'primary',
      fullWidth: false,
      iconOnly: false,
      shape: 'rounded',
    },
  },
  {
    responsiveVariants: true,
  },
);

/**
 * Represents the type of a button theme, which is derived from the `buttonTheme` variant props.
 */
export type ButtonTheme = VariantProps<typeof buttonTheme>;
