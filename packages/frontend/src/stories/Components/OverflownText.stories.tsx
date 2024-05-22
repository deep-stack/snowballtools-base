import { StoryObj, Meta } from '@storybook/react';

import { OverflownText } from 'components/shared/OverflownText';

const meta: Meta<typeof OverflownText> = {
  title: 'Components/OverflownText',
  component: OverflownText,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
    tooltipProps: {
      control: 'object',
    },
  },
};

export default meta;

type Story = StoryObj<typeof OverflownText>;

export const Default: Story = {
  render: ({ children, content, ...args }) => (
    <OverflownText content={content} {...args}>
      {children}
    </OverflownText>
  ),
  args: {
    children:
      'This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. ',
    content:
      'This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. This is an overflown text. ',
  },
};
