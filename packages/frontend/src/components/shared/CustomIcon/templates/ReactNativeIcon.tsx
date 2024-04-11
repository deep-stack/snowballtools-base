import { CustomIcon, CustomIconProps } from '../CustomIcon';

export const ReactNativeIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <g filter="url(#filter0_ii_417_1095)">
        <rect width="40" height="40" rx="8" fill="#00C0F5" />
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
          d="M20.0004 21.7819C20.9849 21.7819 21.783 20.9838 21.783 19.9993C21.783 19.0148 20.9849 18.2167 20.0004 18.2167C19.0159 18.2167 18.2178 19.0148 18.2178 19.9993C18.2178 20.9838 19.0159 21.7819 20.0004 21.7819Z"
          fill="white"
        />
        <path
          d="M19.9998 23.6515C25.2825 23.6515 29.565 22.0164 29.565 19.9993C29.565 17.9823 25.2825 16.3472 19.9998 16.3472C14.7171 16.3472 10.4346 17.9823 10.4346 19.9993C10.4346 22.0164 14.7171 23.6515 19.9998 23.6515Z"
          stroke="white"
        />
        <path
          d="M16.8372 21.8246C19.4786 26.3996 23.0359 29.2908 24.7827 28.2822C26.5295 27.2737 25.8043 22.7474 23.163 18.1724C20.5216 13.5975 16.9643 10.7063 15.2175 11.7148C13.4707 12.7233 14.1959 17.2496 16.8372 21.8246Z"
          stroke="white"
        />
        <path
          d="M16.837 18.173C14.1956 22.7479 13.4704 27.2742 15.2172 28.2828C16.964 29.2913 20.5213 26.4001 23.1627 21.8251C25.8041 17.2502 26.5292 12.7238 24.7824 11.7153C23.0356 10.7068 19.4783 13.598 16.837 18.173Z"
          stroke="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_ii_417_1095"
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
            result="effect1_innerShadow_417_1095"
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
            in2="effect1_innerShadow_417_1095"
            result="effect2_innerShadow_417_1095"
          />
        </filter>
      </defs>
    </CustomIcon>
  );
};
