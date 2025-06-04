import { tuitionEscrowFactoryAbi } from "@/lib/abis/tuitionEscrowFactory";
import { tuitionEscrowFactoryAddress, transactionHash } from "@/lib/addresses";
import { useWriteContract } from "wagmi";
import { toast } from "sonner";

export function useCreateEscrow(
  university: string,
  invoiceRef: string,
  token: string,
  onSuccess?: () => void
) {
  const {
    data: createEscrowHash,
    isPending: isCreateEscrowPending,
    isSuccess: isCreateEscrowSuccess,
    writeContract: createEscrowTransaction,
  } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        toast.success("Escrow created successfully!", {
          description: hash ? `Transaction hash: ${transactionHash}${hash.slice(0, 6)}...${hash.slice(-4)}` : "Transaction submitted",
          duration: 5000,
        });
        onSuccess?.();
      },
    },
  });

  const handleCreateEscrow = () => {
    createEscrowTransaction({
      address: tuitionEscrowFactoryAddress as `0x${string}`,
      abi: tuitionEscrowFactoryAbi,
      functionName: "createEscrow",
      args: [university, invoiceRef, token],
    });
  };

  return { createEscrowHash, isCreateEscrowPending, isCreateEscrowSuccess, handleCreateEscrow };
}
