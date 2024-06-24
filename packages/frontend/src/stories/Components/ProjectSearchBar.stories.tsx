import { StoryObj, Meta } from '@storybook/react';

import { ProjectSearchBar } from 'components/projects/ProjectSearchBar';

const meta: Meta<typeof ProjectSearchBar> = {
  title: 'Components/ProjectSearchBar',
  component: ProjectSearchBar,
  tags: ['autodocs'],
  argTypes: {
    onChange: {
      action: 'change',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectSearchBar>;

export const Default: Story = {};
