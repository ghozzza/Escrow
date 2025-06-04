# Escrow Smart Contract System

A decentralized escrow system built for managing tuition payments between students and universities using smart contracts on the Arbitrum Sepolia network.

## Project Overview

This project consists of two main components:
- `escrow-sc/`: Smart contracts written in Solidity using Foundry
- `escrow-fe/`: Frontend application built with Next.js, RainbowKit, and wagmi

The system allows students to create escrow contracts for their tuition payments, which can only be released to universities upon successful completion of academic requirements or refunded if conditions are not met.

## Smart Contract Information

### Contract Addresses (Arbitrum Sepolia)

- Tuition Escrow Factory: `0xb268f61c7dF38E14574fdC8b042f9Ad25ea0839A`
- Tuition Escrow Implementation: `0x1902BeEC99317B5d1D6E9d3bD9498B8d539365D2`

### Supported Tokens

- USDC: `0x73Bf551d8F0d00eE81a44607C0655747E6A06854`
- USDT: `0x76ca0BE1B7A0da83Fc1B27E50B32fBfDeAf5A698`
- WETH: `0xC145B01CD938B55eEFF795C746F1F203f414ccb5`

## Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- Foundry (for smart contract development)
- MetaMask or any Web3 wallet
- Arbitrum Sepolia testnet ETH

### Smart Contract Setup

1. Navigate to the smart contract directory:
```bash
cd escrow-sc
```

2. Install dependencies:
```bash
forge install
```

3. Build the contracts:
```bash
forge build
```

4. Run tests:
```bash
forge test
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd escrow-fe
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Contract ABIs

The contract ABIs are available in the frontend codebase:
- Tuition Escrow Factory: `escrow-fe/src/lib/abis/tuitionEscrowFactory.ts`
- Tuition Escrow: `escrow-fe/src/lib/abis/tuitionEscrow.ts`

## Features

- Create escrow contracts for tuition payments
- Support for multiple ERC20 tokens (USDC, USDT, WETH)
- Secure deposit and release mechanisms
- Refund functionality for unmet conditions
- University verification system
- Real-time transaction status updates
- Modern, responsive UI with dark mode support

## Security

- Smart contracts are upgradeable using a proxy pattern
- Access control for critical functions
- Secure token handling with standard ERC20 implementations
- Transaction monitoring and event logging