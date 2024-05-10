import { StoryObj, Meta } from '@storybook/react';

import { SegmentedControls } from 'components/shared/SegmentedControls';

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
      action: 'onChange',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SegmentedControls>;

export const Default: Story = {
  render: ({ options, value, onChange }) => (
    <SegmentedControls options={options} value={value} onChange={onChange} />
  ),
  args: {
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
    ],
    value: '1',
  },
};
