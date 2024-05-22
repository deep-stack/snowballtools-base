import { StoryObj, Meta } from '@storybook/react';

import { Step, StepTheme } from 'components/shared/Steps';

const stepOrientations: StepTheme['orientation'][] = ['horizontal', 'vertical'];

const meta: Meta<typeof Step> = {
  title: 'Components/Step',
  component: Step,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: stepOrientations,
    },
    currentIndex: {
      control: 'number',
    },
    label: {
      control: 'text',
    },
    index: {
      control: 'number',
    },
  },
  args: {
    orientation: 'vertical',
    label: 'Create repository',
    index: 1,
    currentIndex: 1,
  },
};

export default meta;

type Story = StoryObj<typeof Step>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const Past: Story = {
  args: {
    index: 1,
    currentIndex: 2,
  },
};
