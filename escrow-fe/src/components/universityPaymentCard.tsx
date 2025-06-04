"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { useEscrowDetails } from "@/lib/hooks/reads/escrowDetails";
import { tokens } from "@/contants/tokens";
import { universities } from "@/contants/universities";
import { useErc20Balance } from "@/lib/hooks/reads/erc20Balance";
import { useErc20Decimal } from "@/lib/hooks/reads/erc20Decimal";
import UniversityPaymentDialog from "./universityPaymentDialog";
import { Address } from "viem";
import { Button } from "./ui/button";
import { useOwnerFactory } from "@/lib/hooks/reads/ownerFactory";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useReleaseEscrow } from "@/lib/hooks/writes/releaseEscrow";
import { useRefundEscrow } from "@/lib/hooks/writes/refundEscrow";

interface UniversityPaymentCardProps {
  index: number;
}

const universityPaymentCard = ({ index }: UniversityPaymentCardProps) => {
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const { data: escrowDetails } = useEscrowDetails(index);

  const addressPayer = escrowDetails?.[0] || "";
  const university =
    universities.find((university) => university.address === escrowDetails?.[1])
      ?.name || "";
  const addressWallet = escrowDetails?.[1] || "";
  const addressEscrow = escrowDetails?.[2] || "";
  const tokenAddress = escrowDetails?.[3] || "";
  const tokenPayment =
    tokens.find((token) => token.address === escrowDetails?.[3])?.name || "";
  const invoiceRef = escrowDetails?.[4] || "";

  const { data: totalAmount, refetchEscrowCount } = useErc20Balance(
    tokenAddress as `0x${string}`,
    addressEscrow as `0x${string}`
  );

  const { data: decimal } = useErc20Decimal(tokenAddress as `0x${string}`);

  const { data: ownerFactory } = useOwnerFactory();

  const { handleReleaseEscrow, isReleaseEscrowSuccess } = useReleaseEscrow(
    addressEscrow as `0x${string}`
  );
  const { handleRefundEscrow, isRefundEscrowSuccess } = useRefundEscrow(
    addressEscrow as `0x${string}`
  );

  useEffect(() => {
    if (isReleaseEscrowSuccess) {
      refetchEscrowCount();
    }
  }, [isReleaseEscrowSuccess, refetchEscrowCount]);

  useEffect(() => {
    if (isRefundEscrowSuccess) {
      refetchEscrowCount();
    }
  }, [isRefundEscrowSuccess, refetchEscrowCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value);
    }
  };
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <>
      <Card
        className="max-w-md cursor-pointer hover:shadow-md transition-shadow bg-muted dark:bg-muted/50 pb-0"
        onClick={() => setIsModalOpen(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="dark:text-white">{university}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground/80 mt-1">
              <Wallet className="h-4 w-4 mr-1" />
              <span>Address: {truncateAddress(addressWallet)}</span>
              {/* <span>Address: {truncateAddress(address)}</span> */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 bg-white dark:bg-gray-800 pb-5 rounded-b-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                Address Payer:
              </span>
              <span className="font-medium dark:text-white">
                {truncateAddress(addressPayer)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                Total Amount:
              </span>
              <span className="font-medium dark:text-white">
                $
                {totalAmount
                  ? (Number(totalAmount) / 10 ** Number(decimal)).toString()
                  : "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                Token Payment:
              </span>
              <span className="font-medium dark:text-white">
                ${tokenPayment}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                Invoice Ref:
              </span>
              <span className="font-medium dark:text-white">{invoiceRef}</span>
            </div>
            <div
              className={`${
                ownerFactory?.toString() === address ? "flex" : "hidden"
              } 
                  justify-between gap-2`}
            >
              <div className="w-full">
                <Button
                  variant="outline"
                  className="w-full bg-red-500 dark:bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (ownerFactory?.toString() !== address) {
                      toast.error("You are not the owner of the factory");
                    } else if (Number(totalAmount) === 0) {
                      toast.error("No amount to refund");
                    } else {
                      handleRefundEscrow();
                    }
                  }}
                >
                  Refund
                </Button>
              </div>
              <div className="w-full">
                <Button
                  variant="outline"
                  className="w-full bg-green-500 dark:bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (ownerFactory?.toString() !== address) {
                      toast.error("You are not the owner of the factory");
                    } else if (Number(totalAmount) === 0) {
                      toast.error("No amount to release");
                    } else {
                      handleReleaseEscrow();
                    }
                  }}
                >
                  Release
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UniversityPaymentDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        university={university}
        invoiceRef={invoiceRef as string}
        addressWallet={addressWallet}
        onSubmit={handleSubmit}
        amount={amount}
        setAmount={setAmount}
        onAmountChange={handleAmountChange}
        decimal={Number(decimal)}
        tokenAddress={tokenAddress as Address}
        escrowAddress={addressEscrow as Address}
        tokenPayment={tokenPayment}
        onDepositSuccess={refetchEscrowCount}
      />
    </>
  );
};

export default universityPaymentCard;
