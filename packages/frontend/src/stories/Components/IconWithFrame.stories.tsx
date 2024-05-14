import { StoryObj, Meta } from '@storybook/react';
import { PlusIcon } from 'components/shared/CustomIcon';

import { IconWithFrame } from 'components/shared/IconWithFrame';

const meta: Meta<typeof IconWithFrame> = {
  title: 'Components/IconWithFrame',
  component: IconWithFrame,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'object',
    },
    hasHighlight: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconWithFrame>;

export const Default: Story = {
  render: ({ icon, hasHighlight }) => (
    <IconWithFrame icon={icon} hasHighlight={hasHighlight} />
  ),
  args: {
    hasHighlight: true,
    icon: <PlusIcon />,
  },
};
