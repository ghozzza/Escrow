import React from "react";
import { HandCoins} from "lucide-react";

const PositionHeader = () => {
  return (
    <div>
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
          <HandCoins className="h-8 w-8 md:h-12 md:w-12 text-emerald-500" />
          <h1>Faucets</h1>
        </div>
      </div>
    </div>
  );
};

export default PositionHeader;
