import { Meta, StoryObj } from '@storybook/react';

import { Button } from 'components/shared/Button';
import { PlusIcon } from 'components/shared/CustomIcon';
import {
  renderButtonIcons,
  renderButtons,
  renderDisabledButtons,
  renderLinks,
} from '../pages/components/renders/button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm', 'xs'],
    },
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'ghost',
        'danger',
        'danger-ghost',
        'link',
        'link-emphasized',
      ],
    },
    fullWidth: {
      control: 'boolean',
    },
    iconOnly: {
      control: { type: 'boolean' },
    },
    shape: {
      control: 'select',
      options: ['default', 'rounded'],
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: ({ children, size, variant, iconOnly, fullWidth, shape }) => (
    <Button
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      iconOnly={iconOnly}
      shape={shape}
    >
      {children}
    </Button>
  ),
  args: {
    children: 'Button',
    size: 'md',
    variant: 'primary',
    fullWidth: false,
    shape: 'rounded',
    iconOnly: false,
  },
};

export const WithIcons: Story = {
  args: {
    ...Default.args,
    leftIcon: <PlusIcon />,
    rightIcon: <PlusIcon />,
  },
};

export const FullWidth: Story = {
  args: {
    ...Default.args,
    fullWidth: true,
  },
};

export const IconOnly: Story = {
  render: ({ leftIcon }) => <Button iconOnly>{leftIcon}</Button>,
  args: {
    ...Default.args,
    leftIcon: <PlusIcon />,
  },
};

export const ButtonAll: Story = {
  render: () => (
    <div className="flex gap-5 flex-col items-center">
      {/* Button */}
      <h1 className="text-2xl font-bold items-center justify-between">Button</h1>
      <div className="flex flex-col gap-10">
        {renderButtons()}
        {renderButtonIcons()}
      </div>

      {/* Link */}
      <div className="flex flex-col gap-10 items-center justify-between">
        <h1 className="text-2xl font-bold">Link</h1>
        <div className="flex gap-4 items-center justify-center">
          {renderLinks()}
        </div>
      </div>

      {/* Disabled button, icon only, and link */}
      <div className="flex flex-col gap-10 items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-center">Disabled</h1>
          <p className="text-lg text-center text-gray-500">
            Button - icon only - link
          </p>
        </div>
        <div className="flex gap-10 items-center justify-between">
          {renderDisabledButtons()}
        </div>
      </div>
    </div>
  ),
};
