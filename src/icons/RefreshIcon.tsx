import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const RefreshIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <g clipPath="url(#clip0_0_8)">
        <path d="M23 12a.982.982 0 00-.988.878A9.986 9.986 0 014.924 19h2.745a1 1 0 000-2h-4a2 2 0 00-2 2v4a1 1 0 102 0v-2.438A11.977 11.977 0 0024 13.1a1.006 1.006 0 00-1-1.1zM21.331 0a1 1 0 00-1 1v2.438A11.977 11.977 0 000 10.9a1.007 1.007 0 001.664.852.982.982 0 00.324-.63A9.986 9.986 0 0119.076 5h-2.745a1 1 0 100 2h4a2 2 0 002-2V1a1 1 0 00-1-1z"></path>
      </g>
      <defs>
        <clipPath id="clip0_0_8">
          <path d="M0 0H24V24H0z"></path>
        </clipPath>
      </defs>
    </SvgIcon>
  );
};

export default RefreshIcon;
