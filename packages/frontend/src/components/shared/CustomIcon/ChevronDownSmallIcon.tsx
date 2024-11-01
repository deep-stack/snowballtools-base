import { CustomIcon, CustomIconProps } from './CustomIcon';

export const ChevronDownSmallIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.4697 14.5303C11.7626 14.8232 12.2374 14.8232 12.5303 14.5303L16.5303 10.5303C16.8232 10.2374 16.8232 9.76256 16.5303 9.46967C16.2374 9.17678 15.7626 9.17678 15.4697 9.46967L12 12.9393L8.53033 9.46967C8.23744 9.17678 7.76256 9.17678 7.46967 9.46967C7.17678 9.76256 7.17678 10.2374 7.46967 10.5303L11.4697 14.5303Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};
