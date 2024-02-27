import { VariantProps, tv } from 'tailwind-variants';

export const projectCardTheme = tv({
  slots: {
    wrapper: [
      'bg-surface-card',
      'shadow-card',
      'rounded-2xl',
      'flex',
      'flex-col',
    ],
    upperContent: ['px-4', 'py-4', 'flex', 'items-start', 'gap-3', 'relative'],
    content: ['flex', 'flex-col', 'gap-1', 'flex-1'],
    title: [
      'text-sm',
      'font-medium',
      'text-elements-high-em',
      'tracking-[-0.006em]',
    ],
    description: ['text-xs', 'text-elements-low-em'],
    icons: ['flex', 'items-center', 'gap-1'],
    lowerContent: [
      'bg-surface-card-hovered',
      'px-4',
      'py-4',
      'flex',
      'flex-col',
      'gap-2',
      'rounded-b-2xl',
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
