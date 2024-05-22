import { CustomIcon, CustomIconProps } from './CustomIcon';

export const SettingsSlidersIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        id="Icon"
        d="M11.2498 5.83341H2.9165M11.2498 5.83341C11.2498 4.22196 12.555 2.91675 14.1665 2.91675C15.778 2.91675 17.0832 4.22196 17.0832 5.83341C17.0832 7.44487 15.778 8.75008 14.1665 8.75008C12.555 8.75008 11.2498 7.44487 11.2498 5.83341ZM17.0832 14.1667H10.4165M10.4165 14.1667C10.4165 15.7782 9.1113 17.0834 7.49984 17.0834C5.88838 17.0834 4.58317 15.7782 4.58317 14.1667M10.4165 14.1667C10.4165 12.5553 9.1113 11.2501 7.49984 11.2501C5.88838 11.2501 4.58317 12.5553 4.58317 14.1667M4.58317 14.1667H2.9165"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CustomIcon>
  );
};
