import { StoryObj, Meta } from '@storybook/react';

import { WavyBorder } from 'components/shared/WavyBorder';

const meta: Meta<typeof WavyBorder> = {
  title: 'Components/WavyBorder',
  component: WavyBorder,
  tags: ['autodocs'],
  args: {
    variant: 'stroke',
  },
};

export default meta;

type Story = StoryObj<typeof WavyBorder>;

export const Default: Story = {
  render: ({ variant }) => <WavyBorder variant={variant} />,
};
