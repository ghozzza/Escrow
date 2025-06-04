import { Address, erc20Abi } from "viem";
import { useReadContract } from "wagmi";

export const useErc20Balance = (tokenAddress: Address, address: Address) => {
  const {
    data,
    isPending,
    isSuccess,
    refetch: refetchEscrowCount,
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });
  
  return { data, isPending, isSuccess, refetchEscrowCount };
};
