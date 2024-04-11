import { CustomIcon, CustomIconProps } from './CustomIcon';

export const CheckIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      {...props}
    >
      <path
        d="M1.5 7.5L4.64706 10L10.5 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
