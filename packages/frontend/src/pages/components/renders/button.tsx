import { Button, ButtonTheme } from 'components/shared/Button';
import { PlusIcon } from 'components/shared/CustomIcon';

const buttonVariants = ['primary', 'secondary', 'tertiary', 'danger'] as const;
const buttonSizes = ['lg', 'md', 'sm', 'xs'] as const;
const iconOnlyVariants = [
  'primary',
  'secondary',
  'tertiary',
  'ghost',
  'danger',
  'danger-ghost',
] as const;
const linkVariants = ['link', 'link-emphasized'] as const;

export const renderButtons = () => {
  return buttonVariants.map((variant, index) => (
    <div className="flex gap-5 flex-wrap" key={index}>
      {buttonSizes.map((size) => (
        <Button
          leftIcon={<PlusIcon />}
          rightIcon={<PlusIcon />}
          variant={variant as ButtonTheme['variant']}
          size={size as ButtonTheme['size']}
          key={`${variant}-${size}`}
        >
          Button
        </Button>
      ))}
    </div>
  ));
};

export const renderButtonIcons = () => {
  return iconOnlyVariants.map((variant, index) => (
    <div className="flex gap-5 flex-wrap" key={index}>
      {buttonSizes.map((size) => (
        <Button
          iconOnly
          variant={variant as ButtonTheme['variant']}
          size={size as ButtonTheme['size']}
          key={`${variant}-${size}`}
        >
          <PlusIcon />
        </Button>
      ))}
    </div>
  ));
};

export const renderLinks = () => {
  return linkVariants.map((variant) => (
    <Button
      variant={variant}
      key={variant}
      leftIcon={<PlusIcon />}
      rightIcon={<PlusIcon />}
    >
      Link
    </Button>
  ));
};

export const renderDisabledButtons = () => {
  return (
    <>
      {/* Button variants */}
      <Button leftIcon={<PlusIcon />} rightIcon={<PlusIcon />} disabled>
        Button
      </Button>
      {/* Icon only variants */}
      <Button iconOnly disabled>
        <PlusIcon />
      </Button>
      {/* Link variantws */}
      <Button
        variant="link"
        disabled
        leftIcon={<PlusIcon />}
        rightIcon={<PlusIcon />}
      >
        Link
      </Button>
    </>
  );
};
