import { CustomIcon, CustomIconProps } from './CustomIcon';

export const GlobeIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M10 17.9167C14.3723 17.9167 17.9167 14.3723 17.9167 10C17.9167 5.62776 14.3723 2.08334 10 2.08334M10 17.9167C5.62776 17.9167 2.08334 14.3723 2.08334 10C2.08334 5.62776 5.62776 2.08334 10 2.08334M10 17.9167C8.15906 17.9167 6.66668 14.3723 6.66668 10C6.66668 5.62776 8.15906 2.08334 10 2.08334M10 17.9167C11.841 17.9167 13.3333 14.3723 13.3333 10C13.3333 5.62776 11.841 2.08334 10 2.08334M17.5 10H2.50001"
        stroke="currentColor"
        strokeLinecap="square"
      />
    </CustomIcon>
  );
};
