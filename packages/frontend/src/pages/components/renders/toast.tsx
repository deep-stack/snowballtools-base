import { Button } from 'components/shared/Button';
import { useToast } from 'components/shared/Toast';

export const renderToastsWithCta = () => {
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

export const renderToast = () => {
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
