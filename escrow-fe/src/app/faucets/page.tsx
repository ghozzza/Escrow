import React from "react";
import PositionHeader from "../../components/PositionHeader";
import FaucetsCard from "../../components/FaucetsCard";


const page = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-8 mt-16">
        <PositionHeader />
        <FaucetsCard />
      </div>
    </div>
  );
};

export default page;
