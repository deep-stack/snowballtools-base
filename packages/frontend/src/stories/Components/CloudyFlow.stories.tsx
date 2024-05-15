import { StoryObj, Meta } from '@storybook/react';

import { CloudyFlow } from 'components/CloudyFlow';

const meta: Meta<typeof CloudyFlow> = {
  title: 'Components/CloudyFlow',
  component: CloudyFlow,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CloudyFlow>;

export const Default: Story = {
  render: ({ ...arg }) => {
    return <CloudyFlow {...arg} />;
  },
  args: {
    className: 'flex flex-col min-h-screen',
  },
};
