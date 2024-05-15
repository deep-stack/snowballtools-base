import { Meta, StoryObj } from '@storybook/react';

import { QuestionMarkRoundIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof QuestionMarkRoundIcon> = {
  title: 'Icons/QuestionMarkRoundIcon',
  component: QuestionMarkRoundIcon,
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

type Story = StoryObj<typeof QuestionMarkRoundIcon>;

export const Default: Story = {
  render: ({ size, name }) => <QuestionMarkRoundIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
