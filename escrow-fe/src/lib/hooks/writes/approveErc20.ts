
import { transactionHash } from "@/lib/addresses";
import { useWriteContract } from "wagmi";
import { toast } from "sonner";
import { Address, erc20Abi } from "viem";

export function useApproveErc20(
  tokenAddress: Address,
  escrowAddress: Address,
  amount:number,
  decimal:number,
  onSuccess?: () => void
) {
  const {
    data: approveErc20Hash,
    isPending: isApproveErc20Pending,
    isSuccess: isApproveErc20Success,
    writeContract: approveErc20Transaction,
  } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        toast.success("Approve successfully!", {
          description: hash ? `Transaction hash: ${transactionHash}${hash.slice(0, 6)}...${hash.slice(-4)}` : "Transaction submitted",
          duration: 5000,
        });
        onSuccess?.();
      },
    },
  });

  const amountInFormat = BigInt(amount ? amount * 10 ** decimal : 0);

  const handleApproveErc20 = () => {
    approveErc20Transaction({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [escrowAddress, amountInFormat],
    });
  };

  return { approveErc20Hash, isApproveErc20Pending, isApproveErc20Success, handleApproveErc20 };
}
