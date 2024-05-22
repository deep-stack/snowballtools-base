import { type ComponentPropsWithoutRef, type ComponentProps } from 'react';
import { avatarTheme, type AvatarVariants } from './Avatar.theme';
import * as PrimitiveAvatar from '@radix-ui/react-avatar';

export type AvatarProps = ComponentPropsWithoutRef<'div'> & {
  imageSrc?: string | null;
  initials?: string;
  imageProps?: ComponentProps<typeof PrimitiveAvatar.Image>;
  fallbackProps?: ComponentProps<typeof PrimitiveAvatar.Fallback>;
} & AvatarVariants;

export const Avatar = ({
  className,
  size,
  type,
  imageSrc,
  imageProps,
  fallbackProps,
  initials,
}: AvatarProps) => {
  const { base, image, fallback } = avatarTheme({ size, type });

  return (
    <PrimitiveAvatar.Root className={base({ className })}>
      {imageSrc && (
        <PrimitiveAvatar.Image
          {...imageProps}
          className={image({ className: imageProps?.className })}
          src={imageSrc}
        />
      )}
      <PrimitiveAvatar.Fallback asChild {...fallbackProps}>
        <div className={fallback({ className: fallbackProps?.className })}>
          {initials}
        </div>
      </PrimitiveAvatar.Fallback>
    </PrimitiveAvatar.Root>
  );
};
