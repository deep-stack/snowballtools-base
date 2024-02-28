import React from 'react';
import { CustomIcon, CustomIconProps } from '../CustomIcon';

export const KotlinIcon = (props: CustomIconProps) => {
  return (
    <CustomIcon
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      {...props}
    >
      <g filter="url(#filter0_ii_417_1111)">
        <rect
          x="0.333496"
          width="40"
          height="40"
          rx="8"
          fill="url(#paint0_linear_417_1111)"
        />
        <rect
          x="0.74421"
          y="0.410714"
          width="39.1786"
          height="39.1786"
          rx="7.58929"
          stroke="#082F56"
          strokeOpacity="0.1"
          strokeWidth="0.821429"
        />
        <g clipPath="url(#clip0_417_1111)">
          <path
            d="M30.1908 29.8591H10.4766V10.1448H30.1908L20.3337 20.0019L30.1908 29.8591Z"
            fill="url(#paint1_linear_417_1111)"
          />
          <path
            d="M30.1908 29.8591H10.4766V10.1448H30.1908L20.3337 20.0019L30.1908 29.8591Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_ii_417_1111"
          x="0.333496"
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
            result="effect1_innerShadow_417_1111"
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
            in2="effect1_innerShadow_417_1111"
            result="effect2_innerShadow_417_1111"
          />
        </filter>
        <linearGradient
          id="paint0_linear_417_1111"
          x1="40.3335"
          y1="-1.19209e-06"
          x2="0.333497"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.00343514" stopColor="#E44857" />
          <stop offset="0.4689" stopColor="#C711E1" />
          <stop offset="1" stopColor="#7F52FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_417_1111"
          x1="30.1908"
          y1="10.1448"
          x2="10.4766"
          y2="29.8591"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.00343514" stopColor="#E44857" />
          <stop offset="0.4689" stopColor="#C711E1" />
          <stop offset="1" stopColor="#7F52FF" />
        </linearGradient>
        <clipPath id="clip0_417_1111">
          <rect
            width="19.7143"
            height="19.7143"
            fill="white"
            transform="translate(10.4766 10.1429)"
          />
        </clipPath>
      </defs>
    </CustomIcon>
  );
};
