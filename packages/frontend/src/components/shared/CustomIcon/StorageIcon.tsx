import { CustomIcon, CustomIconProps } from './CustomIcon';

export const StorageIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        d="M13 3.42576C13 4.39738 10.7614 5.18502 8 5.18502C5.23858 5.18502 3 4.39738 3 3.42576M13 3.42576C13 2.45415 10.7614 1.6665 8 1.6665C5.23858 1.6665 3 2.45415 3 3.42576M13 3.42576V12.5739C13 13.5455 10.7614 14.3332 8 14.3332C5.23858 14.3332 3 13.5455 3 12.5739V3.42576M13 7.92562C13 8.89723 10.7614 9.68488 8 9.68488C5.23858 9.68488 3 8.89723 3 7.92562"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
