import { usdcAddress, usdtAddress, wethAddress } from "@/lib/addresses";

export const tokens = [
  { name: "USDC", address: usdcAddress as `0x${string}`, logo: "/usdc.png" },
  { name: "USDT", address: usdtAddress as `0x${string}`, logo: "/usdt.png" },
  { name: "WETH", address: wethAddress as `0x${string}`, logo: "/weth.png" },
];
