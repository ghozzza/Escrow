"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { mockErc20 } from "@/lib/abis/mockErc20";
import { useAccount, useWriteContract } from "wagmi";
import { AnimatePresence, motion } from "motion/react";
import { tokens } from "@/contants/tokens";
import Image from "next/image";
const FaucetsCardForm = () => {
  const { address } = useAccount();
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const { writeContract } = useWriteContract();

  const handleClaim = () => {
    if (!selectedToken || !amount) {
      toast.error("Please select a token and enter an amount");
      return;
    }
    setIsClaiming(true);
    const decimal = tokens.find(
      (token) => token.address === selectedToken
    )?.decimals;
    try {
      setIsClaiming(false);
      writeContract({
        address: selectedToken as `0x${string}`,
        abi: mockErc20,
        functionName: "mint",
        args: [address, BigInt(amount) * BigInt(10 ** (decimal ?? 18))],
      });
      toast.success("Claimed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to claim");
    } finally {
      setIsClaiming(false);
      setAmount("");
      setSelectedToken("");
    }
  };
  return (
    <div>
      <div className="px-7 w-full">
        <Select value={selectedToken} onValueChange={setSelectedToken}>
          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#01ECBE]/30 dark:border-[#01ECBE]/20 text-[#07094d] dark:text-gray-100">
            <SelectValue placeholder="Select a token" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-[#01ECBE]/30 dark:border-[#01ECBE]/20">
            <SelectGroup>
              <SelectLabel className="text-[#07094d] dark:text-gray-100">
                Tokens
              </SelectLabel>
              <AnimatePresence>
                {tokens
                  .filter((token) => token)
                  .map((token, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                    >
                      <SelectItem
                        className="transition-colors duration-100 cursor-pointer text-[#07094d] dark:text-gray-100 hover:bg-[#01ECBE]/10 dark:hover:bg-[#01ECBE]/20"
                        value={token.address}
                      >
                        <Image
                          src={token.logo}
                          alt={token.name}
                          width={20}
                          height={20}
                        />
                        {token.name}
                      </SelectItem>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d*\.?\d*$/.test(value)) {
              setAmount(value);
            }
          }}
          className="w-full bg-white dark:bg-gray-800 border-[#01ECBE]/30 dark:border-[#01ECBE]/20 text-[#07094d] dark:text-gray-100 mt-5"
          placeholder="0.00"
        />
        <Button
          onClick={handleClaim}
          className="w-full bg-[#141beb] text-white hover:bg-[#141beb]/80 cursor-pointer mt-5 transition-colors duration-300"
        >
          {isClaiming ? "Claiming..." : "Claim"}
        </Button>
        {/* add token address to your wallet*/}

        {/* selectedt token copy shortcut */}
        {selectedToken ? (
          <p className="text-[#07094d] dark:text-gray-100 text-sm mt-5">
            Add token address to your wallet:{" "}
            <button
              className="text-[#141beb] dark:text-[#01ECBE] cursor-pointer hover:underline"
              onClick={() => {
                navigator.clipboard.writeText(selectedToken);
                toast.success("Token address copied to clipboard");
              }}
              title="Click to copy"
            >
              {selectedToken}
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default FaucetsCardForm;
