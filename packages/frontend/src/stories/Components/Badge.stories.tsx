import { Meta, StoryObj } from '@storybook/react';

import { Badge, BadgeTheme } from 'components/shared/Badge';

const badgeVariants: BadgeTheme['variant'][] = [
  'primary',
  'secondary',
  'tertiary',
  'inset',
];
const badgeSizes: BadgeTheme['size'][] = ['xs', 'sm'];

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: badgeVariants,
    },
    size: {
      control: 'select',
      options: badgeSizes,
    },
    children: {
      control: 'object',
    },
  },
  args: {
    variant: 'primary',
    size: 'sm',
    children: '1',
  },
} as Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: ({ variant, size, children, ...args }) => (
    <Badge variant={variant} size={size} {...args}>
      {children}
    </Badge>
  ),
  args: {
    variant: 'primary',
    size: 'sm',
    children: '1',
  },
};

export const Primary: Story = {
  args: {
    ...Default.args,
    children: '1',
  },
};

export const All: Story = {
  render: () => (
    <>
      {badgeVariants.map((variant, index) => (
        <div className="flex gap-5" key={index}>
          {badgeSizes.map((size) => (
            <Badge key={variant} variant={variant} size={size}>
              {size}
            </Badge>
          ))}
          {variant}
        </div>
      ))}
    </>
  ),
};
