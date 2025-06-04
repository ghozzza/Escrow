import { Address, erc20Abi } from "viem";
import { useReadContract } from "wagmi";

export const useErc20Decimal = (tokenAddress: Address) => {
  const {
    data,
    isPending,
    isSuccess,
    refetch: refetchEscrowCount,
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });
  
  return { data, isPending, isSuccess, refetchEscrowCount };
};
