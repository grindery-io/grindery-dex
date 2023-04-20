import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const WalletIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <g clipPath="url(#clip0_765_2977)">
        <path d="M23.06 6.612c.519 0 .938-.42.938-.937V4.69A4.696 4.696 0 0019.308 0S4.614.002 4.578.006a4.785 4.785 0 00-3.281 1.472A4.62 4.62 0 00.005 4.852c-.002.024-.003 13.52-.003 13.52A5.634 5.634 0 005.63 24h13.678a4.696 4.696 0 004.69-4.69v-7.117a4.696 4.696 0 00-4.69-4.69H4.688A2.807 2.807 0 011.88 4.823a2.763 2.763 0 01.773-2.052 2.9 2.9 0 012.089-.894l14.566-.003a2.819 2.819 0 012.815 2.815v.985c0 .517.42.937.938.937zM4.69 9.377h14.619a2.819 2.819 0 012.816 2.816v7.117a2.819 2.819 0 01-2.816 2.815H5.63a3.757 3.757 0 01-3.753-3.753V8.444a4.675 4.675 0 002.812.933zm15.56 6.374c0 .647-.525 1.172-1.172 1.172-1.554-.062-1.554-2.282 0-2.343.647 0 1.172.524 1.172 1.171zm0-11.06a.937.937 0 00-.938-.938H4.69c-1.244.05-1.243 1.826 0 1.875H19.31c.518 0 .938-.42.938-.938z"></path>
      </g>
      <defs>
        <clipPath id="clip0_765_2977">
          <path d="M0 0H24V24H0z"></path>
        </clipPath>
      </defs>
    </SvgIcon>
  );
};

export default WalletIcon;
