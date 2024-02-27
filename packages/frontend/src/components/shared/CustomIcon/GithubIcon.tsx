import React from 'react';
import { CustomIcon, CustomIconProps } from './CustomIcon';

export const GithubIcon: React.FC<CustomIconProps> = (props) => {
  return (
    <CustomIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.9702 0.206024C4.45694 0.206024 0 4.69582 0 10.2503C0 14.6903 2.85571 18.4487 6.81735 19.7789C7.31265 19.8789 7.49408 19.5628 7.49408 19.2968C7.49408 19.064 7.47776 18.2658 7.47776 17.4342C4.70429 18.033 4.12674 16.2368 4.12674 16.2368C3.68102 15.0728 3.02061 14.7736 3.02061 14.7736C2.11286 14.1583 3.08673 14.1583 3.08673 14.1583C4.09367 14.2248 4.62204 15.1893 4.62204 15.1893C5.51327 16.7191 6.94939 16.2868 7.52714 16.0207C7.60959 15.3721 7.87388 14.9232 8.15449 14.6738C5.94245 14.4409 3.6151 13.5762 3.6151 9.71807C3.6151 8.62051 4.01102 7.72256 4.63837 7.02419C4.53939 6.7748 4.19265 5.74358 4.73755 4.36337C4.73755 4.36337 5.57939 4.09725 7.47755 5.39439C8.29022 5.17453 9.12832 5.06268 9.9702 5.06174C10.812 5.06174 11.6702 5.17827 12.4627 5.39439C14.361 4.09725 15.2029 4.36337 15.2029 4.36337C15.7478 5.74358 15.4008 6.7748 15.3018 7.02419C15.9457 7.72256 16.3253 8.62051 16.3253 9.71807C16.3253 13.5762 13.998 14.4242 11.7694 14.6738C12.1327 14.9897 12.4461 15.5883 12.4461 16.5362C12.4461 17.8832 12.4298 18.9642 12.4298 19.2966C12.4298 19.5628 12.6114 19.8789 13.1065 19.7791C17.0682 18.4485 19.9239 14.6903 19.9239 10.2503C19.9402 4.69582 15.4669 0.206024 9.9702 0.206024Z"
        fill="#0B1D2E"
      />
    </CustomIcon>
  );
};
