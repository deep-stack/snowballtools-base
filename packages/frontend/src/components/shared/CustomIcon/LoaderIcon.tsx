import { CustomIcon, CustomIconProps } from './CustomIcon';

export const LoaderIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      {...props}
    >
      <path
        d="M12.5003 3V6M12.5003 18V21M6.13634 5.63604L8.25766 7.75736M16.7429 16.2426L18.8643 18.364M3.5 12.0007H6.5M18.5 12.0007H21.5M6.13634 18.364L8.25766 16.2426M16.7429 7.75736L18.8643 5.63604"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
