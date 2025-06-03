"use client";

import FormCreateTuitionEscrow from "@/components/formCreateTuitionEscrow";
import UniversityPaymentCard from "@/components/universityPaymentCard";
import { universities } from "@/contants/universities";
import { useState } from "react";

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
        {/* Search Bar (Fixed) */}
        <div className="w-full p-4 lg:p-4 border-b bg-white z-10 flex">
          <div className="w-full">
            <input
              type="text"
              placeholder="Search universities..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable University List */}
        <div className="flex-1 overflow-y-auto w-full p-4 lg:p-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex justify-center">
          <div className="w-full max-w-lg">
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
