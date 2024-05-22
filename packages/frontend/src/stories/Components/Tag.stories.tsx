import { StoryObj, Meta } from '@storybook/react';

import { Tag, TagTheme } from 'components/shared/Tag';
import { PlusIcon } from 'components/shared/CustomIcon';

const tagTypes: TagTheme['type'][] = [
  'attention',
  'negative',
  'positive',
  'emphasized',
  'neutral',
];
const tagStyles: TagTheme['style'][] = ['default', 'minimal'];
const tagSizes: TagTheme['size'][] = ['xs', 'sm'];

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'object',
    },
    leftIcon: {
      control: 'object',
    },
    rightIcon: {
      control: 'object',
    },
    type: {
      control: 'select',
      options: tagTypes,
    },
    style: {
      control: 'select',
      options: tagStyles,
    },
    size: {
      control: 'select',
      options: tagSizes,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Tag',
    style: 'default',
    type: 'attention',
    size: 'sm',
  },
};

export const WithLeftIcon: Story = {
  args: {
    ...Default.args,
    leftIcon: <PlusIcon />,
  },
};

export const WithRightIcon: Story = {
  args: {
    ...Default.args,
    rightIcon: <PlusIcon />,
  },
};
