import { VariantProps, tv } from 'tailwind-variants';

export const inlineNotificationTheme = tv({
  slots: {
    wrapper: ['rounded-xl', 'flex', 'gap-2', 'items-start', 'w-full', 'border'],
    content: ['flex', 'flex-col', 'gap-1'],
    title: [],
    description: [],
    icon: ['flex', 'items-start'],
  },
  variants: {
    variant: {
      info: {
        wrapper: ['border-border-info-light', 'bg-base-bg-emphasized-info'],
        title: ['text-elements-on-emphasized-info'],
        description: ['text-elements-on-emphasized-info'],
        icon: ['text-elements-info'],
      },
      danger: {
        wrapper: ['border-border-danger-light', 'bg-base-bg-emphasized-danger'],
        title: ['text-elements-on-emphasized-danger'],
        description: ['text-elements-on-emphasized-danger'],
        icon: ['text-elements-danger'],
      },
      warning: {
        wrapper: [
          'border-border-warning-light',
          'bg-base-bg-emphasized-warning',
        ],
        title: ['text-elements-on-emphasized-warning'],
        description: ['text-elements-on-emphasized-warning'],
        icon: ['text-elements-warning'],
      },
      success: {
        wrapper: [
          'border-border-success-light',
          'bg-base-bg-emphasized-success',
        ],
        title: ['text-elements-on-emphasized-success'],
        description: ['text-elements-on-emphasized-success'],
        icon: ['text-elements-success'],
      },
      generic: {
        wrapper: ['border-border-separator', 'bg-base-bg-emphasized'],
        title: ['text-elements-high-em'],
        description: ['text-elements-on-emphasized-info'],
        icon: ['text-elements-high-em'],
      },
    },
    size: {
      sm: {
        wrapper: ['px-2', 'py-2'],
        title: ['leading-4', 'text-xs'],
        description: ['leading-4', 'text-xs'],
        icon: ['h-4', 'w-4'],
      },
      md: {
        wrapper: ['px-3', 'py-3'],
        title: ['leading-5', 'tracking-[-0.006em]', 'text-sm'],
        description: ['leading-5', 'tracking-[-0.006em]', 'text-sm'],
        icon: ['h-5', 'w-5'],
      },
    },
    hasDescription: {
      true: {
        title: ['font-medium'],
      },
    },
  },
  defaultVariants: {
    variant: 'generic',
    size: 'md',
  },
});

export type InlineNotificationTheme = VariantProps<
  typeof inlineNotificationTheme
>;
