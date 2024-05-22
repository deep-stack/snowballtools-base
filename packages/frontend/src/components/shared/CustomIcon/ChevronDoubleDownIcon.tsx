import { CustomIcon, CustomIconProps } from './CustomIcon';

export const ChevronDoubleDownIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      {...props}
    >
      <path
        d="M6.66699 12.0174L10.0003 15.3507L13.3337 12.0174M6.66699 6.18408L10.0003 9.51742L13.3337 6.18408"
        stroke="currentColor"
        strokeLinecap="square"
      />
    </CustomIcon>
  );
};
