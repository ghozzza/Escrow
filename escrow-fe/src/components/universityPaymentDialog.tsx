"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDepositEscrow } from "@/lib/hooks/writes/depositEscrow";
import { useApproveErc20 } from "@/lib/hooks/writes/approveErc20";
import { Address } from "viem";
import { useErc20Balance } from "@/lib/hooks/reads/erc20Balance";
import { useAccount } from "wagmi";
import {
  HandCoins,
  LoaderCircle,
  ScrollText,
  Send,
  User,
  X,
} from "lucide-react";
import { useEffect } from "react";

interface UniversityPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  university: string;
  invoiceRef: string;
  addressWallet: string;
  onSubmit: (e: React.FormEvent) => void;
  amount: string;
  setAmount: (amount: string) => void;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  decimal: number;
  tokenAddress: Address;
  escrowAddress: Address;
  tokenPayment: string;
  onDepositSuccess?: () => void;
}

const UniversityPaymentDialog = ({
  isOpen,
  onOpenChange,
  university,
  invoiceRef,
  addressWallet,
  onSubmit,
  amount,
  setAmount,
  onAmountChange,
  decimal,
  tokenAddress,
  escrowAddress,
  tokenPayment,
  onDepositSuccess,
}: UniversityPaymentDialogProps) => {
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const { address: addressWalletFormatted } = useAccount();
  const { data: tokenBalance, refetchEscrowCount } = useErc20Balance(
    tokenAddress,
    addressWalletFormatted as Address
  );

  const tokenBalanceFormatted = Number(tokenBalance) / 10 ** Number(decimal);

  const { handleApproveErc20, isApproveErc20Pending, isApproveErc20Success } =
    useApproveErc20(
      tokenAddress,
      escrowAddress,
      Number(amount),
      Number(decimal)
    );
  const {
    handleDepositEscrow,
    isDepositEscrowPending,
    isDepositEscrowSuccess,
  } = useDepositEscrow(Number(amount), Number(decimal), escrowAddress);

  useEffect(() => {
    if (isDepositEscrowSuccess) {
      setAmount("");
      refetchEscrowCount();
      onDepositSuccess?.();
    }
  }, [isDepositEscrowSuccess, setAmount, refetchEscrowCount, onDepositSuccess]);

  const buttonText = () => {
    if (isApproveErc20Pending || isDepositEscrowPending) {
      return (
        <>
          <Send className="size-4 mr-1" />
          Approving...
        </>
      );
    } else if (isApproveErc20Success) {
      return (
        <>
          <Send className="size-4 mr-1" />
          Submit Payment
        </>
      );
    } else {
      return (
        <>
          <Send className="size-4 mr-1" />
          Approve Payment
        </>
      );
    }
  };
  const buttonDisabled =
    isApproveErc20Pending ||
    isDepositEscrowPending ||
    amount === "" ||
    Number(amount) > Number(tokenBalanceFormatted);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Make a Payment</DialogTitle>
          <DialogDescription className="dark:text-muted-foreground/80">
            Enter the amount you want to pay to {university}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="dark:text-white">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white">
                $
              </span>
              <Input
                id="amount"
                type="string"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                value={amount}
                onChange={onAmountChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="dark:text-muted-foreground/80">
                <div className="flex items-center">
                  <div>
                    <HandCoins className="size-4 mr-1" />
                  </div>
                  <div>Your balance:</div>
                </div>
              </span>
              <span className="font-medium dark:text-white">
                {tokenBalanceFormatted} ${tokenPayment}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="dark:text-muted-foreground/80">
                <div className="flex items-center">
                  <div>
                    <ScrollText className="size-4 mr-1" />
                  </div>
                  <div>Invoice Reference:</div>
                </div>
              </span>
              <span className="font-medium dark:text-white">{invoiceRef}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="dark:text-muted-foreground/80">
                <div className="flex items-center">
                  <div>
                    <User className="size-4 mr-1" />
                  </div>
                  <div>Recipient:</div>
                </div>
              </span>
              <span className="font-medium dark:text-white">
                {truncateAddress(addressWallet)}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4 mr-1" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (isApproveErc20Success) {
                  handleDepositEscrow();
                } else {
                  handleApproveErc20();
                }
              }}
              disabled={buttonDisabled}
            >
              {isApproveErc20Pending || isDepositEscrowPending ? (
                <>
                  <LoaderCircle className="animate-spin h-4 w-4 mr-2 inline-block text-white" />
                  {isApproveErc20Pending ? "Approving..." : "Submitting..."}
                </>
              ) : (
                buttonText()
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UniversityPaymentDialog;
