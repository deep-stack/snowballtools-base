import { Meta, StoryObj } from '@storybook/react';

import Page from '../pages/components';

const meta: Meta<typeof Page> = {
  component: Page,
  title: 'Components/All',
};
export default meta;

type Story = StoryObj<typeof Page>;

export const Default: Story = {};
