import { tuitionEscrowFactoryAbi } from "@/lib/abis/tuitionEscrowFactory";
import { tuitionEscrowFactoryAddress } from "@/lib/addresses";
import { useReadContract } from "wagmi";

export const useEscrowDetails = (index: number) => {
  const {
    data,
    isPending,
    isSuccess,
    refetch: refetchEscrowCount,
  } = useReadContract({
    address: tuitionEscrowFactoryAddress as `0x${string}`,
    abi: tuitionEscrowFactoryAbi,
    functionName: "escrows",
    args: [BigInt(index ?? 0)],
  });

  const escrowData = data as
    | readonly [
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        string,
        bigint,
        boolean
      ]
    | undefined;

  return { data: escrowData, isPending, isSuccess, refetchEscrowCount };
};
