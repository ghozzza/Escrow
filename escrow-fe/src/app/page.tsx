"use client";

import FormCreateTuitionEscrow from "@/components/formCreateTuitionEscrow";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useEscrowCount } from "@/lib/hooks/reads/escrowCount";
import EscrowList from "@/components/escrowList";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: escrowCount, isSuccess, refetchEscrowCount } = useEscrowCount();

  const escrowCountNumber = Number(escrowCount);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen overflow-x-hidden pt-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      {/* Left side - Form (Fixed) */}
      <div className="w-full lg:w-1/2 p-3 sm:p-4 lg:p-5 lg:-mt-20 sm:mt-0 border-b lg:border-b-0 lg:border-r lg:min-h-screen lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto">
          <FormCreateTuitionEscrow onEscrowCreated={refetchEscrowCount} />
        </div>
      </div>

      {/* Right side - University List with Search (Scrollable) */}
      <div className="w-full lg:w-1/2 flex flex-col lg:min-h-screen">
        <div className="w-full p-3 sm:p-4 lg:p-4 border-b border-border z-10 mx-auto">
          <div className="relative mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search universities..."
              className="pl-10 pr-4 py-2 w-full bg-background border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable University List */}
        <div className="flex-1 overflow-y-auto w-full p-3 sm:p-4 lg:p-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex justify-center pb-20">
          <div className="w-full max-w-lg relative">
            {isSuccess && typeof escrowCount === "bigint" && (
              <div className="w-full mb-4">
                <p className="text-sm text-gray-500">
                  Total Escrows: {escrowCount.toString()}
                </p>
              </div>
            )}
            <EscrowList count={escrowCountNumber} searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
}
