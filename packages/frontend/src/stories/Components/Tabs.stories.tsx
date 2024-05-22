import { StoryObj, Meta } from '@storybook/react';

import { Tabs } from 'components/shared/Tabs';
import { Badge } from 'components/shared/Badge';
import { GlobeIcon } from 'components/shared/CustomIcon';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const tabs = Array.from({ length: 8 });

export const Default: Story = {
  render: ({ orientation }) => (
    <Tabs defaultValue="A" orientation={orientation}>
      <Tabs.List>
        {tabs.map((_, index) => (
          <Tabs.Trigger key={index} value={index.toString()}>
            Tab item {index}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  ),
  args: {
    orientation: 'horizontal',
  },
};

export const WithBages: Story = {
  render: ({ orientation }) => (
    <Tabs defaultValue="A" orientation={orientation}>
      <Tabs.List>
        {tabs.map((_, index) => (
          <Tabs.Trigger
            key={index}
            value={index.toString()}
            icon={<Badge variant="tertiary">{index}</Badge>}
          >
            Tab item
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  ),
  args: {
    ...Default.args,
  },
};

export const Vertical: Story = {
  render: ({ orientation }) => (
    <Tabs defaultValue="A" orientation={orientation}>
      <Tabs.List>
        {tabs.slice(0, 4).map((_, index) => (
          <Tabs.Trigger
            key={index}
            icon={<GlobeIcon />}
            value={index.toString()}
          >
            Tab item {index}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  ),
  args: {
    orientation: 'vertical',
  },
};
