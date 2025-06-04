import { transactionHash } from "@/lib/addresses";
import { useWriteContract } from "wagmi";
import { toast } from "sonner";
import { tuitionEscrowAbi } from "@/lib/abis/tuitionEscrow";
import { Address } from "viem";

export function useDepositEscrow(
  amount:number,
  decimal:number,
  escrowAddress: Address,
  onSuccess?: () => void
) {
  const {
    data: depositEscrowHash,
    isPending: isDepositEscrowPending,
    isSuccess: isDepositEscrowSuccess,
    writeContract: depositEscrowTransaction,
  } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        toast.success("Deposit successfully!", {
          description: hash ? `Transaction hash: ${transactionHash}${hash.slice(0, 6)}...${hash.slice(-4)}` : "Transaction submitted",
          duration: 5000,
        });
        onSuccess?.();
      },
    },
  });

  const amountInFormat = BigInt(amount ? amount * 10 ** decimal : 0);

  const handleDepositEscrow = () => {
    depositEscrowTransaction({
      address: escrowAddress,
      abi: tuitionEscrowAbi,
      functionName: "deposit",
      args: [amountInFormat],
    });
  };

  return { depositEscrowHash, isDepositEscrowPending, isDepositEscrowSuccess, handleDepositEscrow };
}
