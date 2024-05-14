import { StoryObj, Meta } from '@storybook/react';

import {
  SegmentedControls,
  SegmentedControlsVariants,
  SegmentedControlsOption,
} from 'components/shared/SegmentedControls';

const segmentedControlsTypes: SegmentedControlsVariants['type'][] = [
  'fixed-width',
  'full-width',
];
const segmentedControlsSizes: SegmentedControlsVariants['size'][] = [
  'sm',
  'md',
];
const segmentedControlsOptions: SegmentedControlsOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const meta: Meta<typeof SegmentedControls> = {
  title: 'Components/SegmentedControls',
  component: SegmentedControls,
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
    },
    value: {
      control: 'text',
    },
    onChange: {
      action: 'change',
    },
    type: {
      control: 'select',
      options: segmentedControlsTypes,
    },
    size: {
      control: 'select',
      options: segmentedControlsSizes,
    },
  },
  args: {
    options: segmentedControlsOptions,
    value: '1',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<typeof SegmentedControls>;

export const Default: Story = {
  render: ({ options, value, onChange, ...args }) => (
    <SegmentedControls
      options={options}
      value={value}
      onChange={onChange}
      {...args}
    />
  ),
  args: {
    options: segmentedControlsOptions,
    value: '1',
  },
};
