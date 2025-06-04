import { useMemo } from "react";
import { useEscrowDetails } from "./escrowDetails";
import { universities } from "@/contants/universities";

export function useFilteredEscrows(count: number, searchQuery: string) {
  // Create an array of escrow indices
  const escrowIndices = useMemo(() => 
    Array.from({ length: count }, (_, i) => i),
    [count]
  );

  // Get escrow details for each index
  const escrowDetailsMap = useMemo(() => {
    const details: { [key: number]: any } = {};
    escrowIndices.forEach(index => {
      const { data: escrowDetails } = useEscrowDetails(index);
      details[index] = escrowDetails;
    });
    return details;
  }, [escrowIndices]);

  // Filter based on search query
  return useMemo(() => {
    if (!searchQuery.trim()) return escrowIndices;

    return escrowIndices.filter(index => {
      const escrowDetails = escrowDetailsMap[index];
      const universityAddress = escrowDetails?.[1] || "";
      const university = universities.find((uni) => uni.address === universityAddress)?.name || "";
      return university.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [escrowIndices, escrowDetailsMap, searchQuery]);
} 