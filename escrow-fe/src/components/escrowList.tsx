import { useMemo } from "react";
import { useEscrowDetails } from "@/lib/hooks/reads/escrowDetails";
import { universities } from "@/contants/universities";
import UniversityPaymentCard from "./universityPaymentCard";

interface EscrowListProps {
  count: number;
  searchQuery: string;
}

function EscrowItem({ index, searchQuery }: { index: number; searchQuery: string }) {
  const { data: escrowDetails } = useEscrowDetails(index);
  const universityAddress = escrowDetails?.[1] || "";
  const university = universities.find((uni) => uni.address === universityAddress)?.name || "";

  // If there's a search query, check if this item should be shown
  if (searchQuery.trim() && !university.toLowerCase().includes(searchQuery.toLowerCase())) {
    return null;
  }

  return (
    <div className="w-full mb-4">
      <UniversityPaymentCard key={index} index={index} />
    </div>
  );
}

export default function EscrowList({ count, searchQuery }: EscrowListProps) {
  // Create an array of escrow indices
  const escrowIndices = useMemo(() => 
    Array.from({ length: count }, (_, i) => i),
    [count]
  );

  return (
    <div>
      {escrowIndices.map((index) => (
        <EscrowItem key={index} index={index} searchQuery={searchQuery} />
      ))}
    </div>
  );
} 