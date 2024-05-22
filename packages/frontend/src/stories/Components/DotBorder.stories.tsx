import { StoryObj, Meta } from '@storybook/react';

import { DotBorder } from 'components/shared/DotBorder';

const meta: Meta<typeof DotBorder> = {
  title: 'Components/DotBorder',
  component: DotBorder,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DotBorder>;

export const Default: Story = {};
