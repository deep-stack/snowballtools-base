import { Meta, StoryObj } from '@storybook/react';

import { QuestionMarkRoundFilledIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof QuestionMarkRoundFilledIcon> = {
  title: 'Icons/QuestionMarkRoundFilledIcon',
  component: QuestionMarkRoundFilledIcon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'text',
    },
    name: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof QuestionMarkRoundFilledIcon>;

export const Default: Story = {
  render: ({ size, name }) => (
    <QuestionMarkRoundFilledIcon size={size} name={name} />
  ),
  args: {
    size: '24px',
    name: 'plus',
  },
};
