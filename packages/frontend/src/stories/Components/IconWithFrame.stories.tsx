import { StoryObj, Meta } from '@storybook/react';

import { IconWithFrame } from 'components/shared/IconWithFrame';
import { PlusIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof IconWithFrame> = {
  title: 'Components/IconWithFrame',
  component: IconWithFrame,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'object',
    },
    hasHighlight: {
      type: 'boolean',
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
