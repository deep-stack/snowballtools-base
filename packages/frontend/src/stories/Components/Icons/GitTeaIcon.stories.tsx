import { Meta, StoryObj } from '@storybook/react';

import { GitTeaIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof GitTeaIcon> = {
  title: 'Icons/GitTeaIcon',
  component: GitTeaIcon,
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

type Story = StoryObj<typeof GitTeaIcon>;

export const Default: Story = {
  render: ({ size, name }) => <GitTeaIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
