import { CustomIcon, CustomIconProps } from './CustomIcon';

export const LinkIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.99634 4.3125C5.99634 4.00184 6.24818 3.75 6.55884 3.75H12.1875C13.3266 3.75 14.25 4.67341 14.25 5.8125V12.1844C14.25 12.495 13.9982 12.7469 13.6875 12.7469C13.3769 12.7469 13.125 12.495 13.125 12.1844V5.8125C13.125 5.76745 13.1218 5.72315 13.1157 5.6798L5.27275 13.5227C5.05308 13.7424 4.69692 13.7424 4.47725 13.5227C4.25758 13.3031 4.25758 12.9469 4.47725 12.7273L12.3202 4.88432C12.2768 4.87818 12.2326 4.875 12.1875 4.875H6.55884C6.24818 4.875 5.99634 4.62316 5.99634 4.3125Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};
