import { CustomIcon, CustomIconProps } from './CustomIcon';

export const UndoIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M4.49989 3.75L2.03022 6.21967C1.73732 6.51256 1.73732 6.98744 2.03022 7.28033L4.49989 9.75M2.24989 6.75H13.1249C14.7817 6.75 16.1249 8.09315 16.1249 9.75V10.875C16.1249 12.5319 14.7817 13.875 13.1249 13.875H8.99989"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
