import { Meta, StoryObj } from '@storybook/react';

import { CollaboratorsIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof CollaboratorsIcon> = {
  title: 'Icons/CollaboratorsIcon',
  component: CollaboratorsIcon,
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

type Story = StoryObj<typeof CollaboratorsIcon>;

export const Default: Story = {
  render: ({ size, name }) => <CollaboratorsIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
