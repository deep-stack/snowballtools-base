import { Meta, StoryObj } from '@storybook/react';

import { InfoRoundFilledIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof InfoRoundFilledIcon> = {
  title: 'Icons/InfoRoundFilledIcon',
  component: InfoRoundFilledIcon,
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

type Story = StoryObj<typeof InfoRoundFilledIcon>;

export const Default: Story = {
  render: ({ size, name }) => <InfoRoundFilledIcon size={size} name={name} />,
  args: {
    size: '24px',
    name: 'plus',
  },
};
