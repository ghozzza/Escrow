import { tuitionEscrowFactoryAbi } from "@/lib/abis/tuitionEscrowFactory";
import { tuitionEscrowFactoryAddress } from "@/lib/addresses";
import { useReadContract } from "wagmi";

export const useOwnerFactory = () => {
  const {
    data,
    isPending,
    isSuccess,
    refetch: refetchOwnerFactory,
  } = useReadContract({
    address: tuitionEscrowFactoryAddress as `0x${string}`,
    abi: tuitionEscrowFactoryAbi,
    functionName: "owner",
  });
  return { data, isPending, isSuccess, refetchOwnerFactory };
};
