import { VariantProps, tv } from 'tailwind-variants';

export const projectCardTheme = tv({
  slots: {
    wrapper: [
      'bg-surface-card',
      'shadow-card',
      'rounded-2xl',
      'flex',
      'flex-col',
      'group',
      'cursor-pointer',
    ],
    upperContent: ['px-4', 'py-4', 'flex', 'items-start', 'gap-3', 'relative'],
    content: ['flex', 'flex-col', 'gap-1', 'flex-1', 'overflow-hidden'],
    title: [
      'text-sm',
      'font-medium',
      'text-elements-high-em',
      'tracking-[-0.006em]',
      'truncate',
    ],
    description: ['text-xs', 'text-elements-low-em', 'truncate'],
    icons: ['flex', 'items-center', 'gap-1'],
    lowerContent: [
      'transition-colors',
      'duration-150',
      'px-4',
      'py-4',
      'flex',
      'flex-col',
      'gap-2',
      'rounded-b-2xl',
      'group-hover:bg-surface-card-hovered',
    ],
    latestDeployment: ['flex', 'items-center', 'gap-2'],
    deploymentStatusContainer: [
      'h-3',
      'w-3',
      'flex',
      'items-center',
      'justify-center',
    ],
    deploymentStatus: ['w-1', 'h-1', 'rounded-full'],
    deploymentName: ['text-xs', 'text-elements-low-em'],
    deploymentText: [
      'text-xs',
      'text-elements-low-em',
      'font-mono',
      'flex',
      'items-center',
      'gap-2',
    ],
    wavyBorder: [
      'bg-surface-card',
      'transition-colors',
      'duration-150',
      'group-hover:bg-surface-card-hovered',
    ],
  },
  variants: {
    status: {
      success: {
        deploymentStatus: ['bg-emerald-500'],
      },
      'in-progress': {
        deploymentStatus: ['bg-orange-400'],
      },
      failure: {
        deploymentStatus: ['bg-rose-500'],
      },
      pending: {
        deploymentStatus: ['bg-gray-500'],
      },
    },
  },
  defaultVariants: {
    status: 'pending',
  },
});

export type ProjectCardTheme = VariantProps<typeof projectCardTheme>;
