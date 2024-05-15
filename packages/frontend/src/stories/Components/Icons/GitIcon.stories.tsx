import { Meta, StoryObj } from '@storybook/react';

import { GitIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof GitIcon> = {
  title: 'Icons/GitIcon',
  component: GitIcon,
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

type Story = StoryObj<typeof GitIcon>;

export const Default: Story = {
  render: ({ size, name }) => <GitIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
