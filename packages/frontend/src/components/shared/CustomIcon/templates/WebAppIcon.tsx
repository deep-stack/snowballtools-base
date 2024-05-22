import { CustomIcon, CustomIconProps } from '../CustomIcon';

export const WebAppIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      {...props}
    >
      <g filter="url(#filter0_ii_417_1126)">
        <rect x="0.666504" width="40" height="40" rx="8" fill="#F63184" />
        <rect
          x="1.07722"
          y="0.410714"
          width="39.1786"
          height="39.1786"
          rx="7.58929"
          stroke="#082F56"
          strokeOpacity="0.1"
          strokeWidth="0.821429"
        />
        <path
          d="M20.6667 27.9167C25.0389 27.9167 28.5833 24.3723 28.5833 20C28.5833 15.6278 25.0389 12.0833 20.6667 12.0833M20.6667 27.9167C16.2944 27.9167 12.75 24.3723 12.75 20C12.75 15.6278 16.2944 12.0833 20.6667 12.0833M20.6667 27.9167C18.8257 27.9167 17.3333 24.3723 17.3333 20C17.3333 15.6278 18.8257 12.0833 20.6667 12.0833M20.6667 27.9167C22.5076 27.9167 24 24.3723 24 20C24 15.6278 22.5076 12.0833 20.6667 12.0833M28.1667 20H13.1667"
          stroke="white"
          strokeLinecap="square"
        />
      </g>
      <defs>
        <filter
          id="filter0_ii_417_1126"
          x="0.666504"
          y="0"
          width="40"
          height="40"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_417_1126"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_417_1126"
            result="effect2_innerShadow_417_1126"
          />
        </filter>
      </defs>
    </CustomIcon>
  );
};
