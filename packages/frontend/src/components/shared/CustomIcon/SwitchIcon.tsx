import { CustomIcon, CustomIconProps } from './CustomIcon';

export const SwitchIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M1.25 9.99967C1.25 7.00813 3.67512 4.58301 6.66667 4.58301H13.3333C16.3249 4.58301 18.75 7.00813 18.75 9.99967C18.75 12.9912 16.3249 15.4163 13.3333 15.4163H6.66667C3.67512 15.4163 1.25 12.9912 1.25 9.99967Z"
        stroke="currentColor"
      />
      <path
        d="M10.4167 9.99967C10.4167 8.38884 11.7225 7.08301 13.3333 7.08301C14.9442 7.08301 16.25 8.38884 16.25 9.99967C16.25 11.6105 14.9442 12.9163 13.3333 12.9163C11.7225 12.9163 10.4167 11.6105 10.4167 9.99967Z"
        stroke="currentColor"
      />
    </CustomIcon>
  );
};
