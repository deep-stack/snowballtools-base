import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

/**
 * Defines the theme for a button component.
 */
export const buttonTheme = tv(
  {
    base: [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'whitespace-nowrap',
      'focus-ring',
      'disabled:cursor-not-allowed',
    ],
    variants: {
      size: {
        lg: ['gap-3', 'py-4', 'px-6', 'rounded-lg', 'text-lg'],
        md: ['gap-2', 'py-3', 'px-4', 'rounded-lg', 'text-base'],
        sm: ['gap-1', 'py-2', 'px-2', 'rounded-md', 'text-xs'],
        xs: ['gap-1', 'py-1', 'px-2', 'rounded-md', 'text-xs'],
      },
      fullWidth: {
        true: 'w-full',
      },
      shape: {
        default: '',
        rounded: 'rounded-full',
      },
      variant: {
        primary: [
          'text-elements-on-primary',
          'border',
          'border-primary-700',
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
          'text-components-buttons-secondary-foreground',
          'border',
          'border-primary-500',
          'bg-components-buttons-secondary-background',
          'hover:text-components-buttons-secondary-foreground-hover',
          'hover:bg-components-buttons-secondary-background-hover',
          'focus-visible:text-components-buttons-secondary-foreground-focus',
          'focus-visible:bg-components-buttons-secondary-background-focus',
          'disabled:text-components-buttons-secondary-foreground-disabled',
          'disabled:bg-components-buttons-secondary-background-disabled ',
          'disabled:border-transparent',
        ],
        tertiary: [
          'text-components-buttons-tertiary-background',
          'border',
          'border-components-buttons-tertiary-background',
          'bg-transparent',
          'hover:text-components-buttons-tertiary-hover',
          'hover:border-components-buttons-tertiary-hover',
          'focus-visible:text-components-buttons-tertiary-focus',
          'focus-visible:border-components-buttons-tertiary-focus',
          'disabled:text-components-buttons-tertiary-disabled',
          'disabled:border-components-buttons-tertiary-disabled',
        ],
        'text-only': [
          'text-components-buttons-text-only-background',
          'border',
          'border-transparent',
          'bg-transparent',
          'hover:text-components-buttons-text-only-foreground-hover',
          'hover:bg-components-buttons-text-only-background-hover',
          'focus-visible:text-components-buttons-text-only-foreground-focus',
          'focus-visible:bg-components-buttons-text-only-background-focus',
          'disabled:text-components-buttons-tertiary-disabled',
          'disabled:bg-transparent',
        ],
        danger: [
          'text-components-button-icon-alert-foreground',
          'border',
          'border-transparent',
          'bg-components-buttons-alert-background',
          'hover:text-components-buttons-alert-foreground-hover',
          'hover:bg-components-buttons-alert-background-hover',
          'focus-visible:text-components-buttons-alert-foreground-focus',
          'focus-visible:bg-components-buttons-alert-background-focus',
          'disabled:text-components-button-icon-alert-foreground-disabled',
          'disabled:bg-components-button-icon-alert-background-disabled',
        ],
        'icon-only': [
          'p-0 flex items-center justify-center',
          'text-components-button-icon-text-only-foreground',
          'border',
          'border-transparent',
          'bg-transparent',
          'hover:text-components-button-icon-text-only-foreground-hover',
          'hover:bg-components-button-icon-text-only-background-hover',
          'focus-visible:text-components-button-icon-low-emphasis-foreground-focus',
          'focus-visible:bg-components-button-icon-low-emphasis-background-focus',
          'disabled:text-components-button-icon-low-emphasis-outlined-foreground-disabled',
          'disabled:bg-transparent',
        ],
        unstyled: [],
      },
    },
    compoundVariants: [
      {
        size: 'md',
        variant: 'icon-only',
        class: ['h-11', 'w-11', 'rounded-lg'],
      },
      {
        size: 'sm',
        variant: 'icon-only',
        class: ['h-8', 'w-8', 'rounded-md'],
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'primary',
      fullWidth: false,
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
