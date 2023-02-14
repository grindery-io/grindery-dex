export const SCREEN = {
  TABLET: "768px",
  TABLET_XL: "1024px",
  DESKTOP: "1280px",
  DESKTOP_XL: "1600px",
};

export const ICONS: {[key: string]: string} = {
  DISCONNECT: "/images/icons/disconnect.svg",
  COPY: "/images/icons/copy.svg",
  ACCOUNT: "/images/icons/account.svg",
  CROSS: "/images/icons/cross.svg",
};

export const DEPAY_CONTRACT_ADDRESS =
  "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";

export const DEPAY_ABI = [
  "function approve(address spender, uint256 amount) public virtual override returns (bool)",
];
