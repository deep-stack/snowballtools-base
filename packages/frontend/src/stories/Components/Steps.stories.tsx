import { StoryObj, Meta } from '@storybook/react';

import { Steps, StepsTheme, StepProps } from 'components/shared/Steps';

const stepsOrientations: StepsTheme['orientation'][] = [
  'horizontal',
  'vertical',
];
const stepsOptions: Pick<StepProps, 'label'>[] = [
  {
    label: 'Create repository',
  },
  {
    label: 'Deploy',
  },
  {
    label: `What's next?`,
  },
];

const meta: Meta<typeof Steps> = {
  title: 'Components/Steps',
  component: Steps,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: stepsOrientations,
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
  args: {
    orientation: 'vertical',
    currentIndex: 1,
    steps: stepsOptions,
  },
};

export const Horizontal: Story = {
  args: {
    ...Default.args,
    orientation: 'horizontal',
  },
};

export const Past: Story = {
  args: {
    ...Default.args,
    currentIndex: 2,
  },
};
