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
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_idRequest",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_idOffer",
        type: "uint256",
      },
    ],
    name: "LogAcceptOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_idRequest",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_idOffer",
        type: "uint256",
      },
    ],
    name: "LogCreateOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_idRequest",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
    ],
    name: "LogDeposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_idRequest",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_idOffer",
        type: "uint256",
      },
    ],
    name: "LogOfferPaidCrossChain",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_idRequest",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_idOffer",
        type: "uint256",
      },
    ],
    name: "LogOfferPaidOnChain",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_questionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "_realityQuestionId",
        type: "bytes32",
      },
    ],
    name: "LogQuestionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_idRequest",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_idOffer",
        type: "uint256",
      },
    ],
    name: "LogRejectOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_idRequest",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
    ],
    name: "LogRequest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "LogStake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_templateId",
        type: "uint256",
      },
    ],
    name: "LogTemplateCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "idOffer",
        type: "uint256",
      },
    ],
    name: "acceptOffer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "idOffer",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "questionId",
        type: "bytes32",
      },
      {
        internalType: "bytes32[]",
        name: "history_hashes",
        type: "bytes32[]",
      },
      {
        internalType: "address[]",
        name: "addrs",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "bonds",
        type: "uint256[]",
      },
      {
        internalType: "bytes32[]",
        name: "answers",
        type: "bytes32[]",
      },
    ],
    name: "claimGRTWithDispute",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "idOffer",
        type: "uint256",
      },
    ],
    name: "claimGRTWithoutDispute",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "createOffer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "question",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "templateId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "txHashOffer",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "fromOffer",
        type: "address",
      },
      {
        internalType: "address",
        name: "toOffer",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenOffer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountOffer",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "chainIdOffer",
        type: "uint256",
      },
    ],
    name: "createQuestion",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "txHash",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
        ],
        internalType: "struct GrtDispute.QuestionReality",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "templateERC20",
        type: "string",
      },
    ],
    name: "createRealityTemplate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amntDepGRT",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenRequest",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amntReq",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "chnIdReq",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "destAddr",
        type: "address",
      },
    ],
    name: "depositGRTRequestERC20",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amntDepGRT",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amntReq",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "chnIdReq",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "destAddr",
        type: "address",
      },
    ],
    name: "depositGRTRequestNative",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
    ],
    name: "getDepositAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
    ],
    name: "getDepositChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
    ],
    name: "getDepositToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
    ],
    name: "getFinalAnswer",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
    ],
    name: "getHistoryHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "idOffer",
        type: "uint256",
      },
    ],
    name: "getOfferAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "idOffer",
        type: "uint256",
      },
    ],
    name: "getOfferCreator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
    ],
    name: "getRecipient",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
    ],
    name: "getRequestAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
    ],
    name: "getRequestChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
    ],
    name: "getRequestToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
    ],
    name: "getRequester",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "grtAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "grtChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addrGRT",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainIdGRT",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "addrReality",
        type: "address",
      },
    ],
    name: "initializePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
    ],
    name: "isFinalized",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "idOffer",
        type: "uint256",
      },
    ],
    name: "isOfferAccepted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "idOffer",
        type: "uint256",
      },
    ],
    name: "isOfferPaid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
    ],
    name: "isrequest",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
    ],
    name: "nbrOffersRequest",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "idOffer",
        type: "uint256",
      },
    ],
    name: "payOfferOnChainERC20",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "idOffer",
        type: "uint256",
      },
    ],
    name: "payOfferOnChainNative",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "realityAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "idRequest",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "idOffer",
        type: "uint256",
      },
    ],
    name: "rejectOffer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "setAddrReality",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "setGRTAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "setGRTChainId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "stakeGRT",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "stakeOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public virtual override returns (bool)",
];
