import { CustomIcon, CustomIconProps } from './CustomIcon';

export const ClockOutlineIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        d="M7.99984 5V8L9.99984 10M14.3332 8C14.3332 11.4978 11.4976 14.3333 7.99984 14.3333C4.50203 14.3333 1.6665 11.4978 1.6665 8C1.6665 4.5022 4.50203 1.66667 7.99984 1.66667C11.4976 1.66667 14.3332 4.5022 14.3332 8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
