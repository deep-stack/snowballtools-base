import { CustomIcon, CustomIconProps } from './CustomIcon';

export const CirclePlaceholderOnIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M16.125 9C16.125 12.935 12.935 16.125 9 16.125C5.06497 16.125 1.875 12.935 1.875 9C1.875 5.06497 5.06497 1.875 9 1.875C12.935 1.875 16.125 5.06497 16.125 9Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
