import { CustomIcon, CustomIconProps } from './CustomIcon';

export const ArrowLeftCircleFilledIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM10.4697 15.7803C10.7626 16.0732 11.2374 16.0732 11.5303 15.7803C11.8232 15.4874 11.8232 15.0126 11.5303 14.7197L9.56066 12.75H16.25C16.6642 12.75 17 12.4142 17 12C17 11.5858 16.6642 11.25 16.25 11.25H9.56066L11.5303 9.28033C11.8232 8.98744 11.8232 8.51256 11.5303 8.21967C11.2374 7.92678 10.7626 7.92678 10.4697 8.21967L7.21967 11.4697C6.92678 11.7626 6.92678 12.2374 7.21967 12.5303L10.4697 15.7803Z"
        fill="currentColor"
      />
    </CustomIcon>
  );
};
