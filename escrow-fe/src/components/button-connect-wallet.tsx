"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown } from "lucide-react";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const ButtonConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        openAccountModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";

        if (!ready) {
          return (
            <div
              aria-hidden={true}
              className="opacity-0 pointer-events-none select-none"
            />
          );
        }

        if (!account || !chain) {
          return (
            <div className="relative group w-full sm:w-auto">
              <BackgroundGradient className="rounded-3xl p-[1px] shadow-lg">
                <button
                  onClick={openConnectModal}
                  type="button"
                  className="flex items-center justify-center space-x-1.5 px-4 sm:px-6 py-1.5 rounded-3xl bg-white dark:bg-gray-900 text-[#07094d] dark:text-white font-medium transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] w-full text-sm sm:text-base"
                >
                  <span>Connect Wallet</span>
                </button>
              </BackgroundGradient>
            </div>
          );
        }

        if (chain.unsupported) {
          return (
            <div className="relative group w-full sm:w-auto">
              <BackgroundGradient className="rounded-3xl p-[1px] shadow-lg">
                <button
                  onClick={openChainModal}
                  type="button"
                  className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-1.5 rounded-3xl bg-white dark:bg-gray-900 text-red-500 dark:text-red-400 font-medium transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] w-full text-sm sm:text-base"
                >
                  <span>Wrong Network</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </BackgroundGradient>
            </div>
          );
        }
        return (
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative group w-full sm:w-auto">
              <BackgroundGradient className="rounded-3xl p-[1px] shadow-lg">
                <button
                  onClick={openChainModal}
                  type="button"
                  className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-3xl bg-white dark:bg-gray-900 text-[#07094d] dark:text-white hover:opacity-90 font-medium transition-all w-full text-sm sm:text-base"
                >
                  {chain.hasIcon && chain.iconUrl && (
                    <img
                      src={chain.iconUrl || "/placeholder.svg"}
                      alt={chain.name || "Chain icon"}
                      className="w-4 h-4 rounded-full mr-1"
                      style={{ background: chain.iconBackground }}
                    />
                  )}
                  <span className="truncate max-w-[100px] sm:max-w-[120px]">{chain.name}</span>
                  <ChevronDown className="w-4 h-4 ml-1 opacity-70 flex-shrink-0" />
                </button>
              </BackgroundGradient>
            </div>

            <div className="relative group w-full sm:w-auto">
              <BackgroundGradient className="rounded-3xl p-[1px] shadow-lg">
                <button
                  onClick={openAccountModal}
                  type="button"
                  className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-3xl bg-white dark:bg-gray-900 text-[#07094d] dark:text-white hover:opacity-90 font-medium transition-all w-full text-sm sm:text-base"
                >
                  <span className="truncate max-w-[100px] sm:max-w-[120px]">
                    {account.displayName}
                  </span>
                </button>
              </BackgroundGradient>
            </div>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ButtonConnectWallet;
