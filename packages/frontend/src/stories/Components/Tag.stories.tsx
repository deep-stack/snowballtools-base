import { StoryObj, Meta } from '@storybook/react';

import { Tag } from 'components/shared/Tag';
import { CheckIcon, PlusIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    leftIcon: {
      control: 'object',
    },
    rightIcon: {
      control: 'object',
    },
    type: {
      control: 'select',
      options: ['attention', 'negative', 'positive', 'emphasized', 'neutral'],
    },
    style: {
      control: 'select',
      options: ['default', 'outlined'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  render: ({ children, leftIcon, rightIcon, type, style, size, ...arg }) => (
    <Tag
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      style={style}
      type={type}
      size={size}
      {...arg}
    >
      {children}
    </Tag>
  ),
  args: {
    children: 'Tag',
    style: 'default',
    type: 'attention',
    size: 'sm',
  },
};

export const WithLeftIcon: Story = {
  render: ({ ...arg }) => <Tag {...arg} />,
  args: {
    ...Default.args,
    leftIcon: <CheckIcon />,
  },
};

export const WithRightIcon: Story = {
  render: ({ ...arg }) => <Tag {...arg} />,
  args: {
    ...Default.args,
    rightIcon: <PlusIcon />,
  },
};
