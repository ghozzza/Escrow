import { transactionHash } from "@/lib/addresses";
import { useWriteContract } from "wagmi";
import { toast } from "sonner";
import { tuitionEscrowAbi } from "@/lib/abis/tuitionEscrow";

export function useRefundEscrow(
    escrowAddress: string,
  onSuccess?: () => void
) {
  const {
    data: refundEscrowHash,
    isPending: isRefundEscrowPending,
    isSuccess: isRefundEscrowSuccess,
    writeContract: refundEscrowTransaction,
  } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        toast.success("Escrow refunded successfully!", {
          description: hash ? `Transaction hash: ${transactionHash}${hash.slice(0, 6)}...${hash.slice(-4)}` : "Transaction submitted",
          duration: 5000,
        });
        onSuccess?.();
      },
    },
  });

  const handleRefundEscrow = () => {
    refundEscrowTransaction({
      address: escrowAddress as `0x${string}`,
      abi: tuitionEscrowAbi,
      functionName: "refund",
      args: [],
    });
  };

  return { refundEscrowHash, isRefundEscrowPending, isRefundEscrowSuccess, handleRefundEscrow };
}
