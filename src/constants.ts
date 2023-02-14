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
  "0xe91fc5f6cf045c83d265140abe5271e5600f820c";

export const DEPAY_ABI = [
  "function depositGRTRequestERC20(uint256 amntDepGRT, address tokenRequest, uint256 amntReq, uint256 chnIdReq, address destAddr) external returns (bool)",
  "function acceptOffer(bytes32 idRequest, uint256 idOffer) external returns (bool)",
  "function setGRTAddr(address token) external onlyOwner",
  "function setGRTChainId(uint256 chainId) external onlyOwner",
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public virtual override returns (bool)",
];
