import { StoryObj, Meta } from '@storybook/react';

import { Radio, RadioOption, RadioTheme } from 'components/shared/Radio';

const radioVariants: RadioTheme['variant'][] = ['unstyled', 'card'];
const radioOrientation: RadioTheme['orientation'][] = [
  'horizontal',
  'vertical',
];
const radioOptions: RadioOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
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
      control: 'object',
    },
    onValueChange: {
      action: 'valueChange',
    },
    variant: {
      control: 'select',
      options: radioVariants,
    },
  },
  args: {
    options: radioOptions,
    orientation: 'horizontal',
    value: 'option1',
    onValueChange: (value: string) => console.log(value),
    variant: 'unstyled',
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: ({ options, orientation, value, onValueChange, ...args }) => (
    <Radio
      options={options}
      orientation={orientation}
      value={value}
      onValueChange={onValueChange}
      {...args}
    />
  ),
  args: {
    options: radioOptions,
    orientation: 'horizontal',
    value: 'option1',
    onValueChange: (value) => console.log(value),
  },
};

export const Vertical: Story = {
  render: ({ options, orientation, value, onValueChange, ...args }) => (
    <Radio
      options={options}
      orientation={orientation}
      value={value}
      onValueChange={onValueChange}
      {...args}
    />
  ),
  args: {
    options: radioOptions,
    orientation: 'vertical',
    value: 'option1',
    onValueChange: (value) => console.log(value),
  },
};

export const Card: Story = {
  render: ({ options, orientation, value, onValueChange, ...args }) => (
    <Radio
      options={options}
      orientation={orientation}
      value={value}
      onValueChange={onValueChange}
      {...args}
    />
  ),
  args: {
    options: radioOptions,
    orientation: 'horizontal',
    value: 'option1',
    onValueChange: (value: string) => console.log(value),
    variant: 'card',
  },
};
