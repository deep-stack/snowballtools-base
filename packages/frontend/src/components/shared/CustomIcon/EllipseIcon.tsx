import { CustomIcon, CustomIconProps } from './CustomIcon';

export const EllipseIcon: React.FC<CustomIconProps> = (props) => {
  return (
    <CustomIcon width="9" height="8" viewBox="0 0 9 8" fill="none" {...props}>
      <circle cx="4.5" cy="4" r="4" fill="#082F56" fillOpacity="0.1" />
    </CustomIcon>
  );
};
