import { Meta, StoryObj } from '@storybook/react';

import { GlobeIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof GlobeIcon> = {
  title: 'Icons/GlobeIcon',
  component: GlobeIcon,
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

type Story = StoryObj<typeof GlobeIcon>;

export const Default: Story = {
  render: ({ size, name }) => <GlobeIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
