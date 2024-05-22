import { Meta, StoryObj } from '@storybook/react';

import { ShowEyeIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof ShowEyeIcon> = {
  title: 'Icons/ShowEyeIcon',
  component: ShowEyeIcon,
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

type Story = StoryObj<typeof ShowEyeIcon>;

export const Default: Story = {
  render: ({ size, name }) => <ShowEyeIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
