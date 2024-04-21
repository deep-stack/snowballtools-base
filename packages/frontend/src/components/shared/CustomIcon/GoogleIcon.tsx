import { CustomIcon, CustomIconProps } from './CustomIcon';

export const GoogleIcon: React.FC<CustomIconProps> = (props) => {
  return (
    <CustomIcon
      width="20"
      height="20"
      viewBox="0 0 21 21"
      fill="none"
      {...props}
    >
      <path
        fill="#4285F4"
        fillRule="evenodd"
        d="M19.3 11.219c0-.65-.058-1.275-.167-1.875H10.5v3.546h4.933a4.217 4.217 0 01-1.829 2.766v2.3h2.963C18.3 16.36 19.3 14.01 19.3 11.22z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#34A853"
        fillRule="evenodd"
        d="M10.5 20.179c2.475 0 4.55-.82 6.066-2.22l-2.962-2.3c-.82.55-1.87.874-3.104.874-2.388 0-4.409-1.612-5.13-3.78H2.309v2.376a9.163 9.163 0 008.192 5.05z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#FBBC05"
        fillRule="evenodd"
        d="M5.37 12.753a5.51 5.51 0 01-.287-1.742c0-.604.104-1.191.288-1.741V6.895H2.308a9.163 9.163 0 00-.975 4.116c0 1.48.354 2.88.975 4.117l3.063-2.375z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#EA4335"
        fillRule="evenodd"
        d="M10.5 5.49c1.346 0 2.554.462 3.504 1.37l2.63-2.629C15.045 2.752 12.97 1.844 10.5 1.844a9.163 9.163 0 00-8.192 5.05l3.063 2.375c.72-2.167 2.741-3.78 5.129-3.78z"
        clipRule="evenodd"
      ></path>
    </CustomIcon>
  );
};
