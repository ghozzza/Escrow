import { usdcAddress, usdtAddress, wethAddress } from "@/lib/addresses";

export const tokens = [
  { name: "USDC", address: usdcAddress as `0x${string}`, logo: "/usdc.png", decimals: 6 },
  { name: "USDT", address: usdtAddress as `0x${string}`, logo: "/usdt.png", decimals: 6 },
  { name: "WETH", address: wethAddress as `0x${string}`, logo: "/weth.png", decimals: 18 },
];
