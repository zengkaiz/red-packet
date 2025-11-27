import { GraphQLClient, gql } from "graphql-request";

// The Graph API endpoint
const SUBGRAPH_URL =
  import.meta.env.VITE_SUBGRAPH_URL;

// Create GraphQL client
export const graphClient = new GraphQLClient(SUBGRAPH_URL);

// ========== RedPacket Queries ==========

// GraphQL query to fetch all red packets with stats
export const GET_RED_PACKETS_QUERY = gql`
  query GetRedPackets {
    redPacketStats_collection(
      first: 20
      orderBy: redPacketId
      orderDirection: desc
    ) {
      id
      redPacketId
      creator
      totalAmount
      totalCount
      claimedCount
      remainingAmount
      claimers
    }
  }
`;

// GraphQL query to fetch red packets created by a specific user
export const GET_RED_PACKETS_BY_CREATOR_QUERY = gql`
  query GetRedPacketsByCreator($creator: Bytes!) {
    redPacketStats_collection(
      where: { creator: $creator }
      first: 20
      orderBy: redPacketId
      orderDirection: desc
    ) {
      id
      redPacketId
      creator
      totalAmount
      totalCount
      claimedCount
      remainingAmount
      claimers
    }
  }
`;

// GraphQL query to fetch red packet claim history
export const GET_RED_PACKET_CLAIMS_QUERY = gql`
  query GetRedPacketClaims($redPacketId: BigInt!, $first: Int = 100) {
    redPacketClaimeds(
      where: { redPacketId: $redPacketId }
      first: $first
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      redPacketId
      claimer
      amount
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// TypeScript types for RedPacket queries
export interface RedPacketStats {
  id: string;
  redPacketId: string;
  creator: string;
  totalAmount: string;
  totalCount: string;
  claimedCount: string;
  remainingAmount: string;
  claimers: string[];
}

export interface RedPacketClaimed {
  id: string;
  redPacketId: string;
  claimer: string;
  amount: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface GetRedPacketsResponse {
  redPacketStats_collection: RedPacketStats[];
}

export interface GetRedPacketClaimsResponse {
  redPacketClaimeds: RedPacketClaimed[];
}

// Fetch all red packets
export async function fetchRedPackets(): Promise<RedPacketStats[]> {
  try {
    const data = await graphClient.request<GetRedPacketsResponse>(
      GET_RED_PACKETS_QUERY
    );
    return data.redPacketStats_collection;
  } catch (error) {
    console.error("Error fetching red packets from The Graph:", error);
    throw error;
  }
}

// Fetch red packets by creator
export async function fetchRedPacketsByCreator(
  creator: string
): Promise<RedPacketStats[]> {
  try {
    const data = await graphClient.request<GetRedPacketsResponse>(
      GET_RED_PACKETS_BY_CREATOR_QUERY,
      {
        creator: creator.toLowerCase(),
      }
    );
    return data.redPacketStats_collection;
  } catch (error) {
    console.error("Error fetching red packets by creator:", error);
    throw error;
  }
}

// Fetch claim history for a specific red packet
export async function fetchRedPacketClaims(
  redPacketId: string,
  first: number = 100
): Promise<RedPacketClaimed[]> {
  try {
    const data = await graphClient.request<GetRedPacketClaimsResponse>(
      GET_RED_PACKET_CLAIMS_QUERY,
      {
        redPacketId,
        first,
      }
    );
    return data.redPacketClaimeds;
  } catch (error) {
    console.error("Error fetching red packet claims:", error);
    throw error;
  }
}
