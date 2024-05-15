import { StoryObj, Meta } from '@storybook/react';

import { Toaster, useToast } from 'components/shared/Toast';
import { Button } from 'components/shared/Button';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Toaster>;

// trigger the toast
const Toast = () => {
  const { toast, dismiss } = useToast();

  return (
    <div className="flex gap-10">
      {(['success', 'error', 'warning', 'info', 'loading'] as const).map(
        (variant, index) => (
          <Button
            onClick={() =>
              toast({
                onDismiss: dismiss,
                id: `${variant}_${index}`,
                title: 'Project created',
                variant,
              })
            }
            key={`${variant}_${index}`}
          >
            {variant}
          </Button>
        ),
      )}
    </div>
  );
};

// trigger the toast with cta
const ToastWithCta = () => {
  const { toast, dismiss } = useToast();

  return (
    <div className="flex gap-10">
      {(['success', 'error', 'warning', 'info', 'loading'] as const).map(
        (variant, index) => (
          <Button
            onClick={() =>
              toast({
                onDismiss: dismiss,
                id: `${variant}_${index}`,
                title: 'Project created',
                cta: [
                  {
                    buttonLabel: 'Button',
                    size: 'xs',
                    variant: 'tertiary',
                  },
                  {
                    buttonLabel: 'Button',
                    size: 'xs',
                  },
                ],
                variant,
              })
            }
            key={`${variant}_${index}`}
          >
            {variant} with cta
          </Button>
        ),
      )}
    </div>
  );
};

export const Default: Story = {
  render: ({}) => (
    <div className="flex gap-10">
      <Toast />
      <Toaster />
    </div>
  ),
};

export const WithCta: Story = {
  render: ({}) => (
    <>
      <ToastWithCta />
      <Toaster />
    </>
  ),
};
