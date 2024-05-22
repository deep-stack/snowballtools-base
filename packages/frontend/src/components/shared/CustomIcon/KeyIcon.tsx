import { CustomIcon, CustomIconProps } from './CustomIcon';

export const KeyIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="33"
        height="33"
        fill="none"
        viewBox="0 0 33 33"
      >
        <g clipPath="url(#clip0_2415_13439)">
          <g filter="url(#filter0_i_2415_13439)">
            <path
              fill="#0F86F5"
              fillRule="evenodd"
              d="M1.833 16.691a8 8 0 0114.499-4.666h12.142l3.733 4.666-3.733 4.667h-4.289l-2.352-1.176-2.352 1.176h-3.15a8 8 0 01-14.498-4.667zm8 2a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            ></path>
          </g>
          <path
            stroke="#000"
            strokeOpacity="0.1"
            d="M15.926 12.317l.15.208h12.158l3.333 4.166-3.333 4.167h-3.93l-2.247-1.123-.224-.112-.223.112-2.247 1.123H16.075l-.15.208a7.5 7.5 0 110-8.75zM9.833 19.19a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
          ></path>
        </g>
        <defs>
          <filter
            id="filter0_i_2415_13439"
            width="30.374"
            height="17.5"
            x="1.833"
            y="8.691"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            ></feBlend>
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            ></feColorMatrix>
            <feOffset dy="2"></feOffset>
            <feGaussianBlur stdDeviation="0.75"></feGaussianBlur>
            <feComposite
              in2="hardAlpha"
              k2="-1"
              k3="1"
              operator="arithmetic"
            ></feComposite>
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"></feColorMatrix>
            <feBlend
              in2="shape"
              result="effect1_innerShadow_2415_13439"
            ></feBlend>
          </filter>
          <clipPath id="clip0_2415_13439">
            <path
              fill="#fff"
              d="M0 0H32V32H0z"
              transform="translate(.5 .691)"
            ></path>
          </clipPath>
        </defs>
      </svg>
    </CustomIcon>
  );
};
