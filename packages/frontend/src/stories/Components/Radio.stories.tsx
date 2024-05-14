import { StoryObj, Meta } from '@storybook/react';

import { Radio, RadioTheme } from 'components/shared/Radio';

const radioOrientation: RadioTheme['orientation'][] = [
  'horizontal',
  'vertical',
];

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
    },
    orientation: {
      control: 'radio',
      options: radioOrientation,
    },
    value: {
      control: 'text',
    },
    onValueChange: {
      action: 'onValueChange',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: ({ options, orientation, value, onValueChange }) => (
    <Radio
      options={options}
      orientation={orientation}
      value={value}
      onValueChange={onValueChange}
    />
  ),
  args: {
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    orientation: 'horizontal',
    value: 'option1',
    onValueChange: (value: string) => console.log(value),
  },
};

export const Vertical: Story = {
  render: ({ options, orientation, value, onValueChange }) => (
    <Radio
      options={options}
      orientation={orientation}
      value={value}
      onValueChange={onValueChange}
    />
  ),
  args: {
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    orientation: 'vertical',
    value: 'option1',
    onValueChange: (value: string) => console.log(value),
  },
};
