import { Card } from "@/components/ui/card";
import React from "react";
import FaucetsCardHeader from "./FaucetsCardHeader";
import FaucetsCardForm from "./FaucetsCardForm";

const FaucetsCard = () => {
  return (
    <div>
      <Card className="bg-white dark:bg-gray-800 border-[#01ECBE]/30 dark:border-[#01ECBE]/20 shadow-xl overflow-hidden">
        <FaucetsCardHeader />
        <FaucetsCardForm />
      </Card>
    </div>
  );
};

export default FaucetsCard;
