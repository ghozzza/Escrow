"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Wallet } from "lucide-react";

interface UniversityPaymentCardProps {
  university: string;
  addressWallet: string;
  addressPayer: string;
  totalAmount: string;
  tokenPayment: string;
  invoiceRef: string;
}

const universityPaymentCard = ({
  university,
  addressWallet,
  addressPayer,
  totalAmount,
  tokenPayment,
  invoiceRef,
}: UniversityPaymentCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process payment logic would go here
    console.log("Payment submitted:", amount);
    setIsModalOpen(false);
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
              <span className="font-medium dark:text-white">${totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                Token Payment:
              </span>
              <span className="font-medium dark:text-white">${tokenPayment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                Invoice Ref:
              </span>
              <span className="font-medium dark:text-white">{invoiceRef}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Make a Payment</DialogTitle>
            <DialogDescription className="dark:text-muted-foreground/80">
              Enter the amount you want to pay to {university}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="dark:text-white">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="dark:text-muted-foreground/80">Invoice Reference:</span>
                <span className="font-medium dark:text-white">{invoiceRef}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="dark:text-muted-foreground/80">Recipient:</span>
                <span className="font-medium dark:text-white">
                  {truncateAddress(addressWallet)}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Payment</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default universityPaymentCard;
