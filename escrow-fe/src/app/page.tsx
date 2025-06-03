"use client";

import FormCreateTuitionEscrow from "@/components/formCreateTuitionEscrow";
import UniversityPaymentCard from "@/components/universityPaymentCard";
import { universities } from "@/contants/universities";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUniversities = universities.filter((university) =>
    university.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden pt-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      {/* Left side - Form (Fixed) */}
      <div className="w-full lg:w-1/2 p-4 lg:p-5 border-b lg:border-b-0 lg:border-r lg:h-screen lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <FormCreateTuitionEscrow />
        </div>
      </div>

      {/* Right side - University List with Search (Scrollable) */}
      <div className="w-full lg:w-1/2 flex flex-col lg:h-screen">
        <div className="w-full p-4 lg:p-4 border-b border-border z-10 mx-auto">
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
        <div className="flex-1 overflow-y-auto w-full p-4 lg:p-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex justify-center">
          <div className="w-full max-w-lg relative">
            {filteredUniversities.map((university) => (
              <div key={university.address} className="w-full mb-4">
                <UniversityPaymentCard
                  university={university.name}
                  addressWallet={university.address}
                  addressPayer="0x1234567890abcdef1234567890abcdef12345678"
                  totalAmount="2,500.00"
                  tokenPayment="USDC"
                  invoiceRef="INV-2023-0042"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
