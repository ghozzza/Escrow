import { tuitionEscrowFactoryAbi } from "@/lib/abis/tuitionEscrowFactory";
import { tuitionEscrowFactoryAddress } from "@/lib/addresses";
import { useReadContract } from "wagmi";

export const useEscrowCount = () => {
  const {
    data,
    isPending,
    isSuccess,
    refetch: refetchEscrowCount,
  } = useReadContract({
    address: tuitionEscrowFactoryAddress as `0x${string}`,
    abi: tuitionEscrowFactoryAbi,
    functionName: "escrowCount",
  });
  return { data, isPending, isSuccess, refetchEscrowCount };
};
