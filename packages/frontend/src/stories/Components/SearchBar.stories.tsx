import { StoryObj, Meta } from '@storybook/react';

import SearchBar from 'components/SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};
