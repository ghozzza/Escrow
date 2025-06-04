import { transactionHash } from "@/lib/addresses";
import { useWriteContract } from "wagmi";
import { toast } from "sonner";
import { tuitionEscrowAbi } from "@/lib/abis/tuitionEscrow";

export function useReleaseEscrow(
    escrowAddress: string,
  onSuccess?: () => void
) {
  const {
    data: releaseEscrowHash,
    isPending: isReleaseEscrowPending,
    isSuccess: isReleaseEscrowSuccess,
    writeContract: releaseEscrowTransaction,
  } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        toast.success("Escrow released successfully!", {
          description: hash ? `Transaction hash: ${transactionHash}${hash.slice(0, 6)}...${hash.slice(-4)}` : "Transaction submitted",
          duration: 5000,
        });
        onSuccess?.();
      },
    },
  });

  const handleReleaseEscrow = () => {
    releaseEscrowTransaction({
      address: escrowAddress as `0x${string}`,
      abi: tuitionEscrowAbi,
      functionName: "release",
      args: [],
    });
  };

  return { releaseEscrowHash, isReleaseEscrowPending, isReleaseEscrowSuccess, handleReleaseEscrow };
}
