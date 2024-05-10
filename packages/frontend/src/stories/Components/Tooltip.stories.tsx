import { StoryObj, Meta } from '@storybook/react';

import { ContentProps, Tooltip } from 'components/shared/Tooltip';

const alignments: ContentProps['align'][] = ['start', 'center', 'end'];
const sides: ContentProps['side'][] = ['left', 'top', 'bottom', 'right'];

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    contentProps: {
      control: 'object',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: ({ contentProps, children }) => (
    <Tooltip contentProps={contentProps} content="Tooltip content">
      {children}
    </Tooltip>
  ),
  args: {
    contentProps: {
      align: 'center',
      side: 'top',
    },
    children: <button>Hover me</button>,
  },
};

export const AllAlignments: Story = {
  render: () => (
    <div className="flex gap-10">
      {alignments.map((align) => (
        <Tooltip
          key={align}
          content={`Tooltip content ${align}`}
          contentProps={{ align }}
        >
          <button>Hover me</button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className="flex gap-10">
      {sides.map((side) => (
        <Tooltip
          key={side}
          content={`Tooltip content ${side}`}
          contentProps={{ side }}
        >
          <button>Hover me</button>
        </Tooltip>
      ))}
    </div>
  ),
};
