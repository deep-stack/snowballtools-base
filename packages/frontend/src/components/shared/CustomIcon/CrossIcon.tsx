import { CustomIcon, CustomIconProps } from './CustomIcon';

export const CrossIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M5 5L19 19M19 5L5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </CustomIcon>
  );
};
