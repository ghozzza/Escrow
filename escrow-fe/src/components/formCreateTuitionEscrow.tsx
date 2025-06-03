"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import React, { useState } from "react";
import { universities } from "@/contants/universities";
import { tokens } from "@/contants/tokens";

const formCreateTuitionEscrow = () => {
  const [amount, setAmount] = useState("");

  // Handle amount input to only allow numbers
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value);
    }
  };
  

  return (
    <div className="p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white pb-0 dark:from-purple-700 dark:via-blue-700 dark:to-cyan-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create Tuition Escrow
          </CardTitle>
          <CardDescription className="text-purple-100 dark:text-purple-200">
            Set up a new tuition escrow payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 bg-white dark:bg-gray-900">
          <div className="space-y-2">
            <Label htmlFor="university" className="text-gray-700 dark:text-gray-200 font-medium">
              University
            </Label>
            <Select>
              <SelectTrigger
                id="university"
                className="border-2 border-purple-200/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 dark:border-purple-700/50 dark:focus:border-purple-500 dark:focus:ring-purple-500/20 dark:bg-gray-800 dark:text-gray-200 w-full cursor-pointer transition-all duration-200 rounded-lg shadow-sm hover:border-purple-300 dark:hover:border-purple-600"
              >
                <SelectValue placeholder="Select a university" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                {universities.map((uni) => (
                  <SelectItem
                    key={uni.address}
                    value={uni.address}
                    className="cursor-pointer dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {uni.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Selected university wallet address will be used for the escrow
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="token" className="text-gray-700 dark:text-gray-200 font-medium">
              Payment Token
            </Label>
            <Select>
              <SelectTrigger
                id="token"
                className="border-2 border-purple-200/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 dark:border-purple-700/50 dark:focus:border-purple-500 dark:focus:ring-purple-500/20 dark:bg-gray-800 dark:text-gray-200 w-full cursor-pointer transition-all duration-200 rounded-lg shadow-sm hover:border-purple-300 dark:hover:border-purple-600"
              >
                <SelectValue placeholder="Select payment token" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                {tokens.map((token) => (
                  <SelectItem
                    key={token.address}
                    value={token.address}
                    className="cursor-pointer dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700 dark:text-gray-200 font-medium">
              Amount
            </Label>
            <Input
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="border-2 border-purple-200/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 dark:border-purple-700/50 dark:focus:border-purple-500 dark:focus:ring-purple-500/20 dark:bg-gray-800 dark:text-gray-200 transition-all duration-200 rounded-lg shadow-sm hover:border-purple-300 dark:hover:border-purple-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceRef" className="text-gray-700 dark:text-gray-200 font-medium">
              Invoice Reference
            </Label>
            <Input
              id="invoiceRef"
              placeholder="Enter invoice reference"
              className="border-2 border-purple-200/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 dark:border-purple-700/50 dark:focus:border-purple-500 dark:focus:ring-purple-500/20 dark:bg-gray-800 dark:text-gray-200 transition-all duration-200 rounded-lg shadow-sm hover:border-purple-300 dark:hover:border-purple-600"
            />
          </div>

          <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 dark:from-purple-700 dark:via-blue-700 dark:to-cyan-700 dark:hover:from-purple-800 dark:hover:via-blue-800 dark:hover:to-cyan-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-101 hover:shadow-xl cursor-pointer">
            Create Escrow
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default formCreateTuitionEscrow;
