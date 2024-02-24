import { tv, type VariantProps } from 'tailwind-variants';

export const avatarTheme = tv(
  {
    base: ['relative', 'block', 'rounded-full', 'overflow-hidden'],
    slots: {
      image: [
        'h-full',
        'w-full',
        'rounded-[inherit]',
        'object-cover',
        'object-center',
      ],
      fallback: [
        'grid',
        'select-none',
        'place-content-center',
        'h-full',
        'w-full',
        'rounded-[inherit]',
        'font-medium',
      ],
    },
    variants: {
      type: {
        gray: {
          fallback: ['text-elements-highEm', 'bg-base-bg-emphasized'],
        },
        orange: {
          fallback: ['text-elements-warning', 'bg-base-bg-emphasized-warning'],
        },
        blue: {
          fallback: ['text-elements-info', 'bg-base-bg-emphasized-info'],
        },
      },
      size: {
        18: {
          base: ['rounded-md', 'h-[18px]', 'w-[18px]', 'text-[0.625rem]'],
        },
        20: {
          base: ['rounded-md', 'h-5', 'w-5', 'text-[0.625rem]'],
        },
        24: {
          base: ['rounded-md', 'h-6', 'w-6', 'text-[0.625rem]'],
        },
        28: {
          base: ['rounded-lg', 'h-[28px]', 'w-[28px]', 'text-[0.625rem]'],
        },
        32: {
          base: ['rounded-lg', 'h-8', 'w-8', 'text-xs'],
        },
        36: {
          base: ['rounded-xl', 'h-[36px]', 'w-[36px]', 'text-xs'],
        },
        40: {
          base: ['rounded-xl', 'h-10', 'w-10', 'text-sm'],
        },
        44: {
          base: ['rounded-xl', 'h-[44px]', 'w-[44px]', 'text-sm'],
        },
      },
    },
    defaultVariants: {
      size: 24,
      type: 'gray',
    },
  },
  { responsiveVariants: true },
);

export type AvatarVariants = VariantProps<typeof avatarTheme>;
