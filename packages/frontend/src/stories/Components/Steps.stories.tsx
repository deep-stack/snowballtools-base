import { StoryObj, Meta } from '@storybook/react';

import { Steps } from 'components/shared/Steps';

const meta: Meta<typeof Steps> = {
  title: 'Components/Steps',
  component: Steps,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    currentIndex: {
      control: 'number',
    },
    steps: {
      control: 'object',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Steps>;

export const Default: Story = {
  render: ({ orientation, currentIndex, steps }) => (
    <Steps
      currentIndex={currentIndex}
      steps={steps}
      orientation={orientation}
    />
  ),
  args: {
    currentIndex: 0,
    steps: [
      {
        label: 'Create repository',
      },
      {
        label: 'Deploy',
      },
      {
        label: `What's next?`,
      },
    ],
  },
};

export const Horizontal: Story = {
  render: ({ orientation, currentIndex, steps }) => (
    <Steps
      currentIndex={currentIndex}
      steps={steps}
      orientation={orientation}
    />
  ),
  args: {
    currentIndex: 0,
    steps: [
      {
        label: 'Create repository',
      },
      {
        label: 'Deploy',
      },
      {
        label: `What's next?`,
      },
    ],
    orientation: 'horizontal',
  },
};
