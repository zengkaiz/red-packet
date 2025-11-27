export const RED_PACKET_ADDRESS = "0xb9364ccA32368416660A561822C9f7798c81EE18" as `0x${string}`;

export const RED_PACKET_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "redPacketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "claimer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RedPacketClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "redPacketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "RedPacketCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "redPacketId",
        type: "uint256",
      },
    ],
    name: "claimRedPacket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "createRedPacket",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "redPacketId",
        type: "uint256",
      },
    ],
    name: "getRedPacketInfo",
    outputs: [
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "remainingCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "remainingAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "redPacketId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "hasUserClaimed",
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
        internalType: "uint256",
        name: "redPacketId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserClaimedAmount",
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
] as const;
