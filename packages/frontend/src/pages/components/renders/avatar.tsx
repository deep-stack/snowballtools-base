import { Avatar, AvatarVariants } from 'components/shared/Avatar';

const avatarSizes: AvatarVariants['size'][] = [18, 20, 24, 28, 32, 36, 40, 44];
const avatarVariants: AvatarVariants['type'][] = ['gray', 'orange', 'blue'];

export const avatars = avatarSizes.map((size) => {
  return (
    <Avatar initials="SY" key={String(size)} size={size} imageSrc="/gray.png" />
  );
});

export const avatarsFallback = avatarVariants.map((color) => {
  return avatarSizes.map((size) => {
    return (
      <Avatar initials="SY" key={`${color}-${size}`} type={color} size={size} />
    );
  });
});
