import type { Meta, StoryObj } from '@storybook/react';

import { Header } from './AuthHeader';

const meta: Meta<typeof Header> = {
  title: 'Pages/Auth/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
