import { CustomIcon, CustomIconProps } from '../CustomIcon';

export const PWAIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <g filter="url(#filter0_ii_417_1121)">
        <rect width="40" height="40" rx="8" fill="#12B785" />
        <rect
          x="0.410714"
          y="0.410714"
          width="39.1786"
          height="39.1786"
          rx="7.58929"
          stroke="#082F56"
          strokeOpacity="0.1"
          strokeWidth="0.821429"
        />
        <path
          d="M24.5832 26.25H26.2498M12.9165 24.5833V14.5833C12.9165 13.6628 13.6627 12.9167 14.5832 12.9167H25.4165C26.337 12.9167 27.0832 13.6628 27.0832 14.5833V17.0833M12.9165 24.5833H11.6665V25.4167C11.6665 26.3371 12.4127 27.0833 13.3332 27.0833H22.0832M12.9165 24.5833H22.0832M27.0832 17.0833H23.7498C22.8294 17.0833 22.0832 17.8295 22.0832 18.75V26.25C22.0832 27.1705 22.8294 27.9167 23.7498 27.9167H27.0832C28.0036 27.9167 28.7498 27.1705 28.7498 26.25V18.75C28.7498 17.8295 28.0036 17.0833 27.0832 17.0833Z"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_ii_417_1121"
          x="0"
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
            result="effect1_innerShadow_417_1121"
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
            in2="effect1_innerShadow_417_1121"
            result="effect2_innerShadow_417_1121"
          />
        </filter>
      </defs>
    </CustomIcon>
  );
};
