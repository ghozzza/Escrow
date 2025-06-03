"use client";

import { ModeToggle } from "@/components/mode-toggle";
import ButtonConnectWallet from "../button-connect-wallet";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-200 ${
      scrolled 
        ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Tuition Escrow</h1>
        </div>

        {/* Right side items */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <ModeToggle />
          <ButtonConnectWallet />
        </div>
      </div>
    </nav>
  );
}
